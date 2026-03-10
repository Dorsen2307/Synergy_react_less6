import {useState} from 'react';
import './News.css';

const News = () => {
  const [dataNew, setDataNew] = useState(null);
  const [themeNew, setThemeNew] = useState('');
  const [isDataNew, setIsDataNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // количество новостей на странице

  const getNews = () => {
    fetch(`https://content.guardianapis.com/search?q=${themeNew}&api-key=3981f094-68f3-4a7a-8534-3eb9a4c53708`)
      .then(res => res.json())
      .then(data => {
        setDataNew(data.response);
        data && setIsDataNew(true);
      })

    setCurrentPage(1);
  };

  // Вычисляем индексы для пагинации
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataNew?.results?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((dataNew?.results?.length || 0) / itemsPerPage);

  return (
    <div className='container'>
      <header className="header">
        <div className="header-top">
          <h1 className="header-title">
            <span className="title-icon">📰</span>
            The Guardian News
          </h1>
          <div className="header-decoration"></div>
        </div>

        <div className="search-section">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              className="input-theme"
              value={themeNew}
              onChange={(event) => setThemeNew(event.target.value)}
              placeholder="Введите тему для поиска новостей..."
            />
            {themeNew && (
              <button
                className="clear-input"
                onClick={() => setThemeNew('')}
                aria-label="Очистить"
              >
                ✕
              </button>
            )}
          </div>

          <button
            className="btn"
            onClick={getNews}
            disabled={!themeNew.trim()}
          >
            <span className="btn-text">Найти статьи</span>
            <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>

      <div className="news-container">
        {!isDataNew
          ? (
            <div className="empty-state">
              <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="empty-state-text">Новостей пока нет</p>
            </div>
          ) : (
            <>
              <div className="news-grid">
                {currentItems.map((item, index) => (
                  <article className="news-card" key={item.id || index}>
                    <div className="news-card-header">
                      <span className="news-number">#{indexOfFirstItem + index + 1}</span>
                      <time className="news-date" dateTime={item.webPublicationDate}>
                        {new Date(item.webPublicationDate).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </time>
                    </div>

                    <h3 className="news-title">{item.webTitle}</h3>

                    <div className="news-footer">
                      <a
                        href={item.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="news-link"
                      >
                        <span>Читать далее</span>
                        <svg className="link-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              {/* Если на странице меньше 4 карточек, добавляем плейсхолдеры для сохранения сетки */}
              {currentItems.length < 4 && (
                <div className="grid-placeholders" aria-hidden="true">
                  {[...Array(4 - currentItems.length)].map((_, i) => (
                    <div key={`placeholder-${i}`} className="grid-placeholder" />
                  ))}
                </div>
              )}

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn prev"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <svg className="pagination-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Назад</span>
                  </button>

                  <div className="pagination-pages">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Показываем только текущую страницу, первую, последнюю и соседние
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            className={`pagination-page ${currentPage === pageNumber ? 'active' : ''}`}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                      // Показываем многоточие
                      if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                        return <span key={pageNumber} className="pagination-dots">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    className="pagination-btn next"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span>Вперед</span>
                    <svg className="pagination-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Информация о количестве новостей */}
              <div className="pagination-info">
                Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, dataNew.results.length)} из {dataNew.results.length} новостей
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default News;