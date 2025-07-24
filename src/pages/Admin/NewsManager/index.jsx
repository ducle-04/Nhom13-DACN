import { useEffect, useState } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { searchNews, createNews, updateNews, deleteNews } from '../../../services/api/newsService';

function NewsManager() {
    const [newsList, setNewsList] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' | 'edit'
    const [selectedNews, setSelectedNews] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        imageUrl: '',
    });
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageToShow, setImageToShow] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const baseImagePath = 'http://localhost:5173/images/News/';

    // Lấy danh sách tin tức từ backend
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const newsData = await searchNews(token, '');
                const enrichedNews = newsData.map(news => ({
                    id: news.id,
                    title: news.title,
                    description: news.description || '',
                    imageUrl: news.imageUrl || '/images/News/placeholder.jpg',
                    timestamp: news.timestamp,
                }));
                setNewsList(enrichedNews);
                setError(null);
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [token]);

    // Mở modal thêm/chỉnh sửa
    const handleOpenModal = (type, news = null) => {
        setModalType(type);
        setSelectedNews(news);
        if (type === 'edit' && news) {
            setForm({
                title: news.title,
                description: news.description || '',
                imageUrl: news.imageUrl && news.imageUrl.startsWith(baseImagePath) ? news.imageUrl.replace(baseImagePath, '') : news.imageUrl,
            });
        } else {
            setForm({
                title: '',
                description: '',
                imageUrl: '',
            });
        }
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedNews(null);
        setError(null);
    };

    // Xử lý thay đổi form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Mở modal xem ảnh lớn
    const handleShowImage = (imageUrl) => {
        setImageToShow(imageUrl || '/images/News/placeholder.jpg');
        setShowImageModal(true);
    };

    // Đóng modal xem ảnh
    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setImageToShow(null);
    };

    // Thêm hoặc chỉnh sửa tin tức
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || form.title.trim() === '') {
            setError('Tiêu đề tin tức không được để trống.');
            return;
        }
        const imageUrl = form.imageUrl ? (form.imageUrl.startsWith('http') ? form.imageUrl : `${baseImagePath}${form.imageUrl}`) : null;
        if (imageUrl && imageUrl.startsWith('http') && !isValidUrl(imageUrl)) {
            setError('URL hình ảnh không hợp lệ.');
            return;
        }
        if (imageUrl && !imageUrl.startsWith('http') && !form.imageUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
            setError('Tên tệp hình ảnh phải có đuôi .jpg, .jpeg, .png hoặc .gif.');
            return;
        }

        try {
            const payload = {
                title: form.title,
                description: form.description || null,
                imageUrl: imageUrl,
            };

            if (modalType === 'add') {
                const newNews = await createNews(token, payload);
                setNewsList([...newsList, {
                    id: newNews.id,
                    title: newNews.title,
                    description: newNews.description || '',
                    imageUrl: newNews.imageUrl || '/images/News/placeholder.jpg',
                    timestamp: newNews.timestamp,
                }]);
            } else if (modalType === 'edit' && selectedNews) {
                const updatedNews = await updateNews(token, selectedNews.id, payload);
                setNewsList(newsList.map(n =>
                    n.id === selectedNews.id ? {
                        ...n,
                        title: updatedNews.title,
                        description: updatedNews.description || '',
                        imageUrl: updatedNews.imageUrl || '/images/News/placeholder.jpg',
                        timestamp: updatedNews.timestamp,
                    } : n
                ));
            }
            handleCloseModal();
        } catch (err) {
            setError(err);
            console.error(err);
        }
    };

    // Xóa tin tức
    const handleDelete = async (id) => {
        if (!token) {
            setError('Vui lòng đăng nhập để thực hiện hành động này.');
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn xóa tin tức này?')) {
            try {
                await deleteNews(token, id);
                setNewsList(newsList.filter(n => n.id !== id));
                setError(null);
            } catch (err) {
                setError(err);
                console.error(err);
            }
        }
    };

    // Tìm kiếm tin tức theo tiêu đề
    const handleSearch = async () => {
        try {
            const newsData = await searchNews(token, search);
            const enrichedNews = newsData.map(news => ({
                id: news.id,
                title: news.title,
                description: news.description || '',
                imageUrl: news.imageUrl || '/images/News/placeholder.jpg',
                timestamp: news.timestamp,
            }));
            setNewsList(enrichedNews);
            setError(null);
        } catch (err) {
            setError(err);
            console.error(err);
        }
    };

    // Xóa bộ lọc tìm kiếm và tải lại danh sách tin tức
    const handleClearFilter = async () => {
        setSearch('');
        try {
            const newsData = await searchNews(token, '');
            const enrichedNews = newsData.map(news => ({
                id: news.id,
                title: news.title,
                description: news.description || '',
                imageUrl: news.imageUrl || '/images/News/placeholder.jpg',
                timestamp: news.timestamp,
            }));
            setNewsList(enrichedNews);
            setError(null);
        } catch (err) {
            setError(err);
            console.error(err);
        }
    };

    // Kiểm tra URL hợp lệ
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    if (loading) return <div className="p-6 text-center">Đang tải...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 font-montserrat">Quản lý Tin Tức</h2>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tìm kiếm theo tiêu đề tin tức..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {search && (
                            <FaTimes
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-red-500"
                                onClick={handleClearFilter}
                            />
                        )}
                    </div>
                    <button
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                        onClick={() => handleOpenModal('add')}
                    >
                        <FaPlus className="mr-2" /> Thêm tin tức
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-3 text-left">#</th>
                            <th className="border border-gray-300 p-3 text-left">Hình ảnh</th>
                            <th className="border border-gray-300 p-3 text-left">Tiêu đề</th>
                            <th className="border border-gray-300 p-3 text-left">Mô tả</th>
                            <th className="border border-gray-300 p-3 text-left">Thời gian</th>
                            <th className="border border-gray-300 p-3 text-left">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsList.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-500 py-4">
                                    Không có tin tức phù hợp
                                </td>
                            </tr>
                        ) : (
                            newsList.map((news, idx) => (
                                <tr key={news.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="border border-gray-300 p-3">{idx + 1}</td>
                                    <td className="border border-gray-300 p-3">
                                        <img
                                            src={news.imageUrl}
                                            alt={news.title}
                                            className="w-12 h-12 object-cover rounded cursor-pointer"
                                            onError={(e) => { e.target.src = '/images/News/placeholder.jpg'; }}
                                            onClick={() => handleShowImage(news.imageUrl)}
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-3">{news.title}</td>
                                    <td className="border border-gray-300 p-3">{news.description?.substring(0, 50) || ''}...</td>
                                    <td className="border border-gray-300 p-3">
                                        {new Date(news.timestamp).toLocaleString('vi-VN')}
                                    </td>
                                    <td className="border border-gray-300 p-3 flex space-x-2">
                                        <button
                                            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                            onClick={() => handleOpenModal('edit', news)}
                                        >
                                            <FaEdit className="mr-1" />
                                        </button>
                                        <button
                                            className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                            onClick={() => handleDelete(news.id)}
                                        >
                                            <FaTrash className="mr-1" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal xem ảnh lớn */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl w-full">
                        <img
                            src={imageToShow}
                            alt="News"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            onError={(e) => { e.target.src = '/images/News/placeholder.jpg'; }}
                        />
                        <button
                            className="absolute top-4 right-4 text-white text-2xl font-bold bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700"
                            onClick={handleCloseImageModal}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Modal thêm/chỉnh sửa */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                        <h3 className="text-lg font-bold mb-4">{modalType === 'add' ? 'Thêm tin tức' : 'Chỉnh sửa tin tức'}</h3>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Cột trái */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-medium text-sm">Tiêu đề tin tức *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Nhập tiêu đề tin tức"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium text-sm">Hình ảnh</label>
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.imageUrl}
                                            onChange={handleChange}
                                            placeholder="Nhập tên tệp hoặc URL"
                                        />
                                        {form.imageUrl && (
                                            <img
                                                src={form.imageUrl.startsWith('http') ? form.imageUrl : `${baseImagePath}${form.imageUrl}`}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover mt-2 rounded"
                                                onError={(e) => { e.target.src = '/images/News/placeholder.jpg'; }}
                                            />
                                        )}
                                    </div>
                                </div>
                                {/* Cột phải */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-medium text-sm">Mô tả</label>
                                        <textarea
                                            name="description"
                                            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Nhập mô tả tin tức"
                                            rows="4"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6 space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                    onClick={handleCloseModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {modalType === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewsManager;