import VisitorTracker from "../components/shared/VisitorTracker";
import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import Watermark from "../components/shared/Watermark";
import ScrollToTop from "../components/shared/ScrollToTop";
import DownloadGateModal from "../components/media/DownloadGateModal";
// import Topbar from "../components/shared/Topbar";

const CommonLayout = () => {
  return (
    <>
      <ScrollToTop />
      <VisitorTracker />
      <DownloadGateModal />
      {/* <Topbar /> */}
      <Navbar />
      <Watermark />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default CommonLayout;
