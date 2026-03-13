import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeFirebase } from './config/firebase';
import routes from './routes';
import { AVAILABILITY_CONFIG } from './config/constants';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
  initializeFirebase();
} catch (error) {
  console.error('Failed to initialize Firebase. Exiting...');
  process.exit(1);
}

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    config: {
      startHour: AVAILABILITY_CONFIG.START_HOUR,
      endHour: AVAILABILITY_CONFIG.END_HOUR,
      slotDuration: AVAILABILITY_CONFIG.SLOT_DURATION_MINUTES,
      timezone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
    },
  });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Calendar Appointment API Server                 ║
║                                                       ║
║   Status: Running                                     ║
║   Port: ${PORT}                                       ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║                                                       ║
║   Availability Config:                                ║
║   • Hours: ${AVAILABILITY_CONFIG.START_HOUR}:00 - ${AVAILABILITY_CONFIG.END_HOUR}:00                             ║
║   • Slot Duration: ${AVAILABILITY_CONFIG.SLOT_DURATION_MINUTES} minutes                          ║
║   • Timezone: ${AVAILABILITY_CONFIG.DEFAULT_TIMEZONE}                  ║
║                                                       ║
║   Endpoints:                                          ║
║   • GET  /health                                      ║
║   • GET  /api/slots/free?date=YYYY-MM-DD&timezone=... ║
║   • POST /api/events                                  ║
║   • GET  /api/events?startDate=...&endDate=...        ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;
