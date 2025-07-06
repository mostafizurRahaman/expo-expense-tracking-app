import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
   /**
    * for production grade application we have to provide user_id/email/ip_address for this
    * Now We donot have authentication implemented thats why we  are using default one name 'my-rate-limit'
    *
    *  */

   try {
      const { success } = await ratelimit?.limit("my-rate-limit");
      console.log(success);

      if (!success) {
         return res.status(429).json({
            success: true,
            message: `Too Many Request. Please try again later!!!`,
            data: null,
         });
      }

      next();
   } catch (err) {
      console.log("Rate limiter Error", err);
      res.status(500).json({
         success: false,
         message: "Internal server error",
         data: null,
      });
   }
};

export default rateLimiter;
