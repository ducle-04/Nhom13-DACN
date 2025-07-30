import { Route, Routes, useLocation } from 'react-router-dom';
import { PublicPage, PrivatePage } from './router';
import ScrollToTop from './components/OtherComponent/ScrollToTop';
import { CartProvider } from '../src/Context/CartContext';
import Cart from '../src/components/Layout/DefautLayout/UserLayout/Cart';
import PrivateRoute from './components/PrivateRoute';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  // Danh sách các route cần ẩn nút giỏ hàng
  const hiddenCartButtonRoutes = ['/login', '/register'];

  return (
    <CartProvider>
      <div className="relative">
        <ScrollToTop />

        {/* Nút mở giỏ hàng - ẩn trên trang login và register */}
        {!hiddenCartButtonRoutes.includes(location.pathname) && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed top-4 right-4 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition-colors duration-200 z-40"
            aria-label="Mở giỏ hàng"
          >
            <ShoppingCart className="w-6 h-6" />
          </button>
        )}

        {/* Giỏ hàng dạng sidebar */}
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {/* Điều hướng các route */}
        <Routes>
          {/* Route công khai */}
          {PublicPage.map((page, index) => {
            const Page = page.component;
            const Layout = page.layout;

            return (
              <Route
                key={index}
                path={page.path}
                element={
                  Layout ? (
                    <Layout>
                      <Page />
                    </Layout>
                  ) : (
                    <Page />
                  )
                }
              />
            );
          })}

          {/* Route riêng tư (ADMIN) */}
          {PrivatePage.map((page, index) => (
            <Route
              key={index}
              path={page.path}
              element={<PrivateRoute component={page.component} layout={page.layout} />}
            />
          ))}
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;