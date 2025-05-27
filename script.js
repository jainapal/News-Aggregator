let currentIndex = 0;
const loadSize = 5;

function renderNews(items) {
    const newsList = document.getElementById('news-list');
    const nextItems = items.slice(currentIndex, currentIndex + loadSize);
    nextItems.forEach(item => {
        const li = document.createElement('li');
        const h2 = document.createElement('h2');
        const a = document.createElement('a');
        const shareLink = document.createElement('button');
        const bookmarkBtn = document.createElement('button');

        h2.textContent = item.title;
        a.textContent = 'Read more';
        a.href = item.link;
        a.target = '_blank';

        // Share Button
        shareLink.textContent = 'Share';
        shareLink.style.marginLeft = '10px';
        shareLink.onclick = () => {
            const shareData = { title: item.title, url: item.link };
            navigator.share(shareData).catch(console.error);
        };

        // Bookmark Button
        bookmarkBtn.textContent = 'Bookmark';
        bookmarkBtn.style.marginLeft = '10px';
        bookmarkBtn.onclick = () => {
            let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
            bookmarks.push({ title: item.title, link: item.link });
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            alert('News bookmarked!');
        };

        li.appendChild(h2);
        li.appendChild(document.createTextNode(item.description));
        li.appendChild(a);
        li.appendChild(shareLink);
        li.appendChild(bookmarkBtn);
        newsList.appendChild(li);
    });
    currentIndex += loadSize;
    if (currentIndex >= items.length) {
        document.getElementById('load-more').style.display = 'none';
    }
}

fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ftechcrunch.com%2Ffeed%2F')
.then(response => response.json())
.then(data => {
    const allItems = data.items;

    // Initial Render
    renderNews(allItems);

    // Load More Button
    document.getElementById('load-more').addEventListener('click', () => renderNews(allItems));

    // Search Functionality
    document.getElementById('search-bar').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll('#news-list li');
        items.forEach(item => {
            const title = item.querySelector('h2').textContent.toLowerCase();
            if (title.includes(query)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Dark Mode Toggle
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
