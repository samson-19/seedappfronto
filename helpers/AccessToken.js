export const getSupertoken = () => {
     if (typeof window !== "undefined") {
       return localStorage.getItem("usertoken");
     }
     return null;
   };
   