import { Route, Routes } from 'react-router-dom';
import { PublicPage } from './pages';
import ScrollToTop from './components/OtherComponent/ScrollToTop';
import { CartProvider } from '../src/Context/CartContext';
import Cart from '../src/components/Layout/DefautLayout/UserLayout/Cart';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="relative">
        <ScrollToTop />
        {/* Nút mở giỏ hàng */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed top-4 right-4 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition-colors duration-200 z-40"
          aria-label="Mở giỏ hàng"
        >
          <ShoppingCart className="w-6 h-6" />
        </button>
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <Routes>
          {PublicPage.map((page, index) => {
            console.log(page);
            const Page = page.component;
            const Layout = page.layout;

            if (!Layout) {
              return (
                <Route
                  key={index}
                  path={page.path}
                  element={<Page />}
                />
              );
            } else {
              return (
                <Route
                  key={index}
                  path={page.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            }
          })}
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;