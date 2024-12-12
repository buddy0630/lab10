      // Глобал хувьсагч үүсгэх
      let newsItems = [];

      // RSS өгөгдөл авах функц
      function fetchNews() {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", "https://cors-anywhere.herokuapp.com/https://ikon.mn/rss.xml", true);
          xhr.onload = function () {
              if (xhr.status === 200) {
                  const parser = new DOMParser();
                  const xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
                  const items = xmlDoc.getElementsByTagName("item");

                  if (items.length > 0) {
                      const newsList = document.getElementById("news-list");
                      newsList.innerHTML = "";

                      newsItems = Array.from(items).slice(0, 12).map((item, index) => {
                          const title = item.getElementsByTagName("title")[0]?.textContent || "Гарчиг байхгүй";
                          const link = item.getElementsByTagName("link")[0]?.textContent || "#";
                          const description = item.getElementsByTagName("description")[0]?.textContent || "Дэлгэрэнгүй мэдээлэл байхгүй";
                          
                          // Try to extract image from description
                          const imageMatch = description.match(/<img[^>]+src="([^">]+)"/);
                          const imageUrl = imageMatch ? imageMatch[1] : 'https://via.placeholder.com/300x200?text=Мэдээ';

                          const newsItem = document.createElement("div");
                          newsItem.classList.add("news-card");
                          newsItem.dataset.index = index;
                          newsItem.innerHTML = `
                              <img src="${imageUrl}" alt="${title}" class="news-card-image" onerror="this.src='https://via.placeholder.com/300x200?text=Мэдээ'">
                              <div class="news-card-content">
                                  <h2 class="news-card-title">${title}</h2>
                                  <p class="news-card-description">${description.replace(/<[^>]*>/g, '')}</p>
                              </div>
                          `;
                          
                          // Add click event listener
                          newsItem.addEventListener('click', () => showSingleNews(index));
                          
                          newsList.appendChild(newsItem);

                          return {
                              title,
                              link,
                              description,
                              imageUrl
                          };
                      });
                  } else {
                      document.getElementById("news-list").innerHTML = '<div class="error">Мэдээлэл олдсонгүй!</div>';
                  }
              } else {
                  console.error("RSS татахад алдаа гарлаа.");
                  document.getElementById("news-list").innerHTML = '<div class="error">Мэдээ ачаалахад алдаа гарлаа.</div>';
              }
          };
          xhr.onerror = function () {
              console.error("Хүсэлт илгээхэд алдаа гарлаа.");
              document.getElementById("news-list").innerHTML = '<div class="error">Сүлжээний алдаа гарлаа.</div>';
          };
          xhr.send();
      }

      // Дан мэдээний хуудас харуулах функц
      function showSingleNews(index) {
          const news = newsItems[index];
          const singleNewsContainer = document.getElementById("single-news");
          const newsListContainer = document.getElementById("news-list");

          // Дан мэдээний агуулга бэлдэх
          singleNewsContainer.innerHTML = `
              <a href="#" class="back-button" onclick="showNewsList(); return false;">◀ Буцах</a>
              <img src="${news.imageUrl}" alt="${news.title}" class="single-news-image" onerror="this.src='https://via.placeholder.com/1200x600?text=Мэдээ'">
              <h1 class="single-news-title">${news.title}</h1>
              <div class="single-news-content">
                  ${news.description.replace(/<[^>]*>/g, '')}
                  <p><br><a href="${news.link}" target="_blank">Эх сурвалж руу очих</a></p>
              </div>
          `;

          // Жагсаалтыг нуух, дан мэдээг харуулах
          newsListContainer.style.display = 'none';
          singleNewsContainer.style.display = 'block';
      }

      // Мэдээний жагсаалт руу буцах функц
      function showNewsList() {
          const singleNewsContainer = document.getElementById("single-news");
          const newsListContainer = document.getElementById("news-list");

          // Мэдээний жагсаалтыг харуулах, дан мэдээг нуух
          newsListContainer.style.display = 'grid';
          singleNewsContainer.style.display = 'none';
      }

      // Анхны өгөгдөл татах
      fetchNews();