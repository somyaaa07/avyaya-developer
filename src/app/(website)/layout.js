import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';

export default function WebsiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}