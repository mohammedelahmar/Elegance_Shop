const errorMiddleware = (err, req, res, next) => {
     // Set status code, defaulting to 500 (Server Error) if not already set
     const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
     res.status(statusCode);
   
     res.json({
       message: err.message,
       // Only show stack trace in development mode
       stack: process.env.NODE_ENV === 'production' ? null : err.stack,
     });
   };
   
   export default errorMiddleware;
   