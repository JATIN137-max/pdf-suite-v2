// controllers/pdfController.js
// Proxies Word<->PDF conversion requests to the standalone conversion
// service (FastAPI + LibreOffice + pdf2docx) so this main backend never
// needs LibreOffice installed itself. Left open (no login required),
// gated instead by the pdfLimiter middleware mounted in server.js.

const axios = require('axios');
const FormData = require('form-data');

const CONVERSION_SERVICE_URL = process.env.CONVERSION_SERVICE_URL;
// e.g. https://your-conversion-service.onrender.com - set this in Render's
// environment variables for the main backend once the sidecar is deployed.

async function proxyConversion(req, res, endpoint, outFilename, outContentType) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  if (!CONVERSION_SERVICE_URL) {
    console.error('CONVERSION_SERVICE_URL is not set in the environment.');
    return res.status(500).json({ message: 'Conversion service is not configured yet.' });
  }

  try {
    const form = new FormData();
    form.append('file', req.file.buffer, { filename: req.file.originalname });

    const response = await axios.post(
      `${CONVERSION_SERVICE_URL}${endpoint}`,
      form,
      {
        headers: form.getHeaders(),
        responseType: 'arraybuffer',
        // The sidecar is a free-tier Render service too - it may need to
        // cold-start (~30-60s) before it even begins converting.
        timeout: 100000,
      }
    );

    res.set('Content-Type', outContentType);
    res.set('Content-Disposition', `attachment; filename="${outFilename}"`);
    res.send(response.data);
  } catch (error) {
    if (error.response) {
      // Conversion service responded with a real error (bad file, too large, etc.)
      let message = 'Conversion failed. Please try a different file.';
      try {
        const parsed = JSON.parse(Buffer.from(error.response.data).toString('utf-8'));
        message = parsed.detail || message;
      } catch (_) {
        // Response wasn't JSON - keep the default message.
      }
      return res.status(error.response.status || 500).json({ message });
    }
    console.error('Conversion proxy error:', error.message);
    res.status(503).json({
      message: 'The conversion service is waking up or unavailable. Please try again in a moment.',
    });
  }
}

exports.wordToPdf = (req, res) =>
  proxyConversion(req, res, '/convert/word-to-pdf', 'converted.pdf', 'application/pdf');

exports.pdfToWord = (req, res) =>
  proxyConversion(
    req,
    res,
    '/convert/pdf-to-word',
    'converted.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );