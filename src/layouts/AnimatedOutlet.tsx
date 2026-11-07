import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

const AnimatedOutlet = () => {
  const { pathname } = useLocation();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Outlet />
    </motion.div>
  );
};

export default AnimatedOutlet;
