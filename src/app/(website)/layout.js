import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';
import AutoEnquiryModal from '@/component/AutoEnquiryModal';

export default function WebsiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <AutoEnquiryModal />
    </>
  );
}