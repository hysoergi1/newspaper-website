// Global variables
let currentUser = null;
let carouselIndex = 0;
let carouselInterval;
let isCarouselPaused = false;

// Page navigation
function showPage(pageName) {
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageName).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[data-page="${pageName}"]`);
    if (activeLink) activeLink.classList.add('active');

    window.scrollTo(0, 0);
}

// Top bar date update
function updateTopBarDate() {
    const dateElement = document.getElementById('dynamic-date');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString('sq-AL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}

// Update the date every second
setInterval(updateTopBarDate, 60000);

document.addEventListener('DOMContentLoaded', function() {
    // Reset zodiac signs to ensure all 12 are present (including Demi)
    const defaultZodiacs = [
        { name: 'Dashi', dateRange: '21 Mars - 19 Prill', emoji: '♈', description: 'Sot është dita juaj për të marrë vendime të gutshmëra. Përqendrohuni në objektivat tuaja dhe mos u lejoni nga pengesat.' },
        { name: 'Demi', dateRange: '20 Prill - 20 Maj', emoji: '♉', description: 'Yjet ju favorizojnë për romancë dhe lidhje personale. Kjo mund të jetë një ditë e mirë për të marrë rreziqe në dashuri.' },
        { name: 'Binjakët', dateRange: '21 Maj - 20 Qershor', emoji: '♊', description: 'Komunikimi është çelësi juaj sot. Shprehni idetë tuaja dhe dëgjoni atë që kanë për të thënë të tjerët.' },
        { name: 'Gaforrja', dateRange: '21 Qershor - 22 Korrik', emoji: '♋', description: 'Mbrojeni shpirtit tuaj dhe nuk hapni durrin shpejt. Besoni në instinktit tuaj - ai nuk do t\'ju mashtroj.' },
        { name: 'Luani', dateRange: '23 Korrik - 22 Gusht', emoji: '♌', description: 'Kjo është koha juaj për të rrezikuar! Favorizat planet për ndërmarrje dhe lidershipin. Bëhuni qendër vëmendjes.' },
        { name: 'Virgjëresha', dateRange: '23 Gusht - 22 Shtator', emoji: '♍', description: 'Përqendrohuni në detaje sot. Analiza juaj e mprehtë do t\'ju ndihmojë të zgjidhni problemet që ka rreth jush.' },
        { name: 'Peshorja', dateRange: '23 Shtator - 22 Tetor', emoji: '♎', description: 'Balancimi i përsosur është atë që duhet të kërkoni sot. Vendosni kohe për miqësi dhe lidhje romantike.' },
        { name: 'Akrepi', dateRange: '23 Tetor - 21 Nëntor', emoji: '♏', description: 'Fuqia juaj e transformimit është në pikën më të lartë. Refuzojuni atë që nuk ka më nevojë për juve.' },
        { name: 'Shigjetari', dateRange: '22 Nëntor - 21 Dhjetor', emoji: '♐', description: 'Aventura të reja ju presin! Hapni mendjen ndaj mundësive të reja dhe eksploroni rrugë të panjohura.' },
        { name: 'Bricjapi', dateRange: '22 Dhjetor - 19 Janar', emoji: '♑', description: 'Arritjet e juaja janë brenda arritjeve tuaj. Punoni me disiplinë dhe përcaktim për të arritur objektivat.' },
        { name: 'Ujori', dateRange: '20 Janar - 18 Shkurt', emoji: '♒', description: 'Inovasioni dhe kreativiteti janë me ju. Eksprimoni individualitetin tuaj dhe mos kini frikë të jeni ndryshe.' },
        { name: 'Peshqit', dateRange: '19 Shkurt - 20 Mars', emoji: '♓', description: 'Intuitivi juaj është jashtëzakonisht e fortë sot. Dëgjojni zërin tuaj të brendshëm dhe besoni në ndihen tuaj.' }
    ];
    
    // Check if Demi exists in localStorage, if not reset to defaults
    const storedZodiacs = JSON.parse(localStorage.getItem('dynamic_zodiacs'));
    if (!storedZodiacs || storedZodiacs.length < 12 || !storedZodiacs.some(z => z.name === 'Demi')) {
        localStorage.setItem('dynamic_zodiacs', JSON.stringify(defaultZodiacs));
        zodiacSigns = defaultZodiacs;
    }
    
    // Setup navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.dataset.page;
            showPage(pageName);
            
            // Refresh category-specific content when navigating
            if (pageName === 'lajme') {
                loadAllNews();
            } else if (pageName === 'aktivitete') {
                loadActivities();
            } else if (pageName === 'horoscope') {
                loadHoroscopePage();
            } else if (pageName === 'studente') {
                loadStudents();
            }
        });
    });

    // Setup Admin Panel Tab Navigation (News vs Horoscope)
    const adminTabs = document.querySelectorAll('.admin-tab-btn');
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            adminTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const targetSection = this.getAttribute('data-target');
            document.querySelectorAll('.admin-section-content').forEach(section => {
                section.style.display = 'none';
            });
            const activeSection = document.getElementById(targetSection);
            if (activeSection) activeSection.style.display = 'block';
        });
    });

    // Load content on page load
    loadHeroNews();
    loadCarousel();
    loadAllNews();
    loadActivities();
    loadStudents();
    createArticleModal();
    loadHeroHoroscope();
    generateSudoku();
    loadDailyRiddle();
    startCarouselAutoplay();

    // Ndalo karuzelin kur mausi është sipër
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', () => {
            isCarouselPaused = true;
            if (carouselInterval) {
                clearInterval(carouselInterval);
            }
        });
        carouselWrapper.addEventListener('mouseleave', () => {
            isCarouselPaused = false;
            resetCarouselAutoplay();
        });
    }
});

// Helper: Get reading time and first 2 sentences
function getArticleStats(content) {
    const words = content.split(' ').length;
    const readTime = Math.ceil(words / 200); // 200 words per minute
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 0);
    const summary = sentences.slice(0, 2).join('. ') + '.';
    return { readTime, summary };
}

function createArticleModal() {
    if (document.getElementById('fullArticleModal')) return;
    const modal = document.createElement('div');
    modal.id = 'fullArticleModal';
    modal.className = 'article-modal';
    modal.innerHTML = `
        <span class="modal-close-btn" onclick="closeArticleModal()">&times;</span>
        <div class="article-modal-content" id="articleModalBody">
            <!-- AJAX content here -->
        </div>
    `;
    document.body.appendChild(modal);
}

function openFullArticle(id) {
    const modal = document.getElementById('fullArticleModal');
    const body = document.getElementById('articleModalBody');
    modal.style.display = 'block';
    body.innerHTML = '<div style="padding: 100px; text-align: center; font-size: 20px; color: #666;">Duke u ngarkuar...</div>';
    
    fetch(`api.php?action=get_news_by_id&id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const news = data.data;
                const date = new Date(news.date).toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' });
                body.innerHTML = `
                    <img src="${news.image}" class="modal-hero-img">
                    <div class="modal-body-padding">
                        <span class="carousel-card-badge">${news.category.toUpperCase()}</span>
                        <h2>${news.title}</h2>
                        <div class="news-card-meta" style="margin-bottom: 30px; font-size: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">Publikuar më ${date} | Autori: Stafi Gazetës</div>
                        <div style="font-size: 19px; color: #333; line-height: 1.8; white-space: pre-line;">${news.content}</div>
                    </div>
                `;
            }
        });
}

function closeArticleModal() {
    document.getElementById('fullArticleModal').style.display = 'none';
}

// Load hero news (latest)
function loadHeroNews() {
    fetch('api.php?action=get_latest_news')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data) {
                const news = data.data;
                // Save to localStorage
                localStorage.setItem('hero_news', JSON.stringify(news));
                displayHeroNews(news);
            }
        })
        .catch(error => {
            console.error('Error loading hero news:', error);
            // Try to load from localStorage if API fails
            const cachedNews = localStorage.getItem('hero_news');
            if (cachedNews) {
                displayHeroNews(JSON.parse(cachedNews));
            }
        });
}

function displayHeroNews(news) {
    if (!news || !news.title) {
        // Show placeholder if no news
        document.getElementById('heroTitle').textContent = 'Duke ngarkuar...';
        document.getElementById('heroContent').textContent = 'Ju lutemi prisni...';
        document.getElementById('heroImage').src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect fill="%23cccccc" width="600" height="400"/></svg>';
        document.getElementById('heroMeta').textContent = '';
        return;
    }
    
    document.getElementById('heroTitle').textContent = news.title;
    document.getElementById('heroContent').textContent = news.content.substring(0, 180) + '...';
    document.getElementById('heroImage').src = news.image;
    
    const date = new Date(news.date).toLocaleDateString('sq-AL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    document.getElementById('heroMeta').textContent = `Publikuar më ${date}`;

    // Përditësojmë butonin e Hero News për të hapur artikullin specifik në modal
    const heroBtn = document.getElementById('heroBtn');
    if (heroBtn) {
        heroBtn.onclick = (e) => {
            e.preventDefault();
            openFullArticle(news.id);
        };
    }
}

// Load carousel news
function loadCarousel() {
    fetch('api.php?action=get_carousel_news')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Save to localStorage
                localStorage.setItem('carousel_news', JSON.stringify(data.data));
                displayCarousel(data.data);
            }
        })
        .catch(error => {
            console.error('Error loading carousel:', error);
            // Try to load from localStorage if API fails
            const cachedNews = localStorage.getItem('carousel_news');
            if (cachedNews) {
                displayCarousel(JSON.parse(cachedNews));
            }
        });
}

function displayCarousel(newsArray) {
    const track = document.getElementById('carouselTrack');
    const nav = document.getElementById('carouselNav');
    if(!track || !nav) return;
    
    track.innerHTML = '';
    track.style.transform = 'translateX(0)'; // Resetohet pozicioni vizual në fillim
    nav.innerHTML = '';

    // Resetohet index-i në fillim kur ngarkohen lajme të reja
    carouselIndex = 0;

    if (!newsArray || newsArray.length === 0) {
        track.innerHTML = '<div style="padding: 40px; text-align: center; color: #999; grid-column: 1/-1;">Nuk ka lajme të tjera për të shfaqur</div>';
        return;
    }

    const itemsPerSlide = 6;
    for (let i = 0; i < newsArray.length; i += itemsPerSlide) {
        const page = document.createElement('div');
        page.className = 'carousel-page';
        
        const slideItems = newsArray.slice(i, i + itemsPerSlide);
        slideItems.forEach(news => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            card.onclick = () => openFullArticle(news.id);
            
            const date = new Date(news.date).toLocaleDateString('sq-AL', {
                day: 'numeric',
                month: 'long'
            });
            
            card.innerHTML = `
                <div class="card-hover-overlay">
                    <span class="read-more-text">Lexo më tej</span>
                </div>
                <img src="${news.image}" alt="${news.title}">
                <div class="carousel-card-content">
                    <span class="carousel-card-badge">${news.category === 'aktivitet' ? 'AKTIVITET' : 'LAJM'}</span>
                    <h3>${news.title}</h3>
                    <p>${news.content.substring(0, 100)}...</p>
                    <div class="carousel-card-meta">${date}</div>
                </div>
            `;
            page.appendChild(card);
        });
        track.appendChild(page);
    }

    const totalSlides = Math.ceil(newsArray.length / 6);
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToCarouselSlide(i);
        nav.appendChild(dot);
    }

    // Sinkronizojmë dote-t dhe pozicionin menjëherë pas ngarkimit
    updateCarousel();
}

// Carousel navigation
function nextCarousel() {
    const pages = document.querySelectorAll('.carousel-page');
    if(pages.length === 0) return;
    const totalSlides = pages.length;
    carouselIndex = (carouselIndex + 1) % totalSlides;
    updateCarousel();
}

function prevCarousel() {
    const pages = document.querySelectorAll('.carousel-page');
    if(pages.length === 0) return;
    const totalSlides = pages.length;
    carouselIndex = (carouselIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToCarouselSlide(index) {
    carouselIndex = index;
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    const wrapper = document.querySelector('.carousel-wrapper');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if(track && wrapper) {
        const step = wrapper.offsetWidth;
        track.style.transform = `translateX(-${carouselIndex * step}px)`;
    }
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === carouselIndex);
    });

    resetCarouselAutoplay();
}

function startCarouselAutoplay() {
    carouselInterval = setInterval(nextCarousel, 5000);
}

function resetCarouselAutoplay() {
    clearInterval(carouselInterval);
    if (!isCarouselPaused) {
        startCarouselAutoplay();
    }
}

// Load all news
function loadAllNews() {
    fetch('api.php?action=get_news_by_category&category=lajm')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const grid = document.getElementById('newsGrid');
                if(!grid) return;
                grid.innerHTML = '';
                
                data.data.forEach(news => {
                    const card = document.createElement('div');
                    card.className = 'news-card';
                    card.onclick = () => openFullArticle(news.id);

                    const date = new Date(news.date).toLocaleDateString('sq-AL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                    
                    card.innerHTML = `
                        <div class="card-hover-overlay">
                            <span class="read-more-text">Lexo më tej</span>
                        </div>
                        <img src="${news.image}" alt="${news.title}">
                        <div class="news-card-content">
                            <h3>${news.title}</h3>
                            <p>${news.content.substring(0, 120)}...</p>
                            <div class="news-card-meta">Publikuar më ${date}</div>
                        </div>
                    `;
                    grid.appendChild(card);
                });
            }
        })
        .catch(error => console.error('Error loading news:', error));
}

// Load activities
function loadActivities() {
    fetch('api.php?action=get_news_by_category&category=aktivitet')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const grid = document.getElementById('activitiesGrid');
                if(!grid) return;
                grid.innerHTML = '';
                
                data.data.forEach(activity => {
                    const card = document.createElement('div');
                    card.className = 'activity-card';
                    card.onclick = () => openFullArticle(activity.id);

                    const date = new Date(activity.date).toLocaleDateString('sq-AL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                    
                    card.innerHTML = `
                        <div class="card-hover-overlay">
                            <span class="read-more-text">Lexo më tej</span>
                        </div>
                        <img src="${activity.image}" alt="${activity.title}">
                        <div class="activity-card-content">
                            <span class="activity-badge">AKTIVITET</span>
                            <h3>${activity.title}</h3>
                            <p>${activity.content.substring(0, 120)}...</p>
                            <div class="news-card-meta">Publikuar më ${date}</div>
                        </div>
                    `;
                    grid.appendChild(card);
                });
            }
        })
        .catch(error => console.error('Error loading activities:', error));
}

// Load students section articles
function loadStudents() {
    fetch('api.php?action=get_news_by_category&category=studente')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const grid = document.getElementById('studentsGrid');
                if(!grid) return;
                grid.innerHTML = '';
                
                if (data.data.length === 0) {
                    grid.innerHTML = '<div style="padding: 40px; text-align: center; color: #999; grid-column: 1/-1;">Nuk ka artikuj për studentët në këtë moment</div>';
                    return;
                }
                
                data.data.forEach(student => {
                    const card = document.createElement('div');
                    card.className = 'news-card';
                    card.onclick = () => openFullArticle(student.id);

                    const date = new Date(student.date).toLocaleDateString('sq-AL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                    
                    card.innerHTML = `
                        <div class="card-hover-overlay">
                            <span class="read-more-text">Lexo më tej</span>
                        </div>
                        <img src="${student.image}" alt="${student.title}">
                        <div class="news-card-content">
                            <h3>${student.title}</h3>
                            <p>${student.content.substring(0, 120)}...</p>
                            <div class="news-card-meta">Publikuar më ${date}</div>
                        </div>
                    `;
                    grid.appendChild(card);
                });
            }
        })
        .catch(error => console.error('Error loading students:', error));
}

// Modal functions
function openModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('message').style.display = 'none';
}

// Login function
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    const formData = new FormData();
    formData.append('action', 'login');
    formData.append('username', username);
    formData.append('password', password);

    fetch('api.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUser = username;
            message.className = 'success';
            message.textContent = data.message;
            message.style.display = 'block';
            
            setTimeout(() => {
                closeModal();
                openAdminPanel();
            }, 1000);
        } else {
            message.className = 'error';
            message.textContent = data.message;
            message.style.display = 'block';
        }
    })
    .catch(error => {
        message.className = 'error';
        message.textContent = 'Gabim në lidhje me serverin';
        message.style.display = 'block';
    });
}

// Admin panel functions
function openAdminPanel() {
    document.getElementById('adminModal').style.display = 'block';
    loadAdminNews();
    loadAdminHoroscope(); // Load horoscope admin list
}

function closeAdminPanel() {
    document.getElementById('adminModal').style.display = 'none';
    hideAddNews();
    hideAddHoroscope();
}

function showAddNews() {
    document.getElementById('addNewsForm').style.display = 'block';
}

function hideAddNews() {
    document.getElementById('addNewsForm').style.display = 'none';
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsContent').value = '';
    document.getElementById('newsImage').value = '';
    document.getElementById('newsCategory').value = 'lajm';
}

// Add news function
function addNews(event) {
    event.preventDefault();
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    const category = document.getElementById('newsCategory').value;
    const image = document.getElementById('newsImage').value;

    const formData = new FormData();
    formData.append('action', 'add_news');
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('image', image);

    fetch('api.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const message = document.getElementById('adminMessage');
        if (data.success) {
            message.className = 'success';
            message.textContent = data.message;
            message.style.display = 'block';
            
            // Reload all content
            loadHeroNews();
            loadCarousel();
            loadAllNews();
            loadActivities();
            loadStudents();
            loadAdminNews();
            hideAddNews();
            
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);
        } else {
            message.className = 'error';
            message.textContent = data.message;
            message.style.display = 'block';
        }
    })
    .catch(error => {
        const message = document.getElementById('adminMessage');
        message.className = 'error';
        message.textContent = 'Gabim në lidhje me serverin';
        message.style.display = 'block';
    });
}

// Load admin news table
function loadAdminNews() {
    fetch('api.php?action=get_all_news')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const table = document.getElementById('adminNewsTable');
                if(!table) return;
                table.innerHTML = '';
                
                data.data.forEach(news => {
                    const row = document.createElement('tr');
                    const date = new Date(news.date).toLocaleDateString('sq-AL');
                    
                    row.innerHTML = `
                        <td>${news.title}</td>
                        <td>${news.category === 'aktivitet' ? 'Aktivitet' : (news.category === 'studente' ? 'Studentë' : 'Lajm')}</td>
                        <td>${date}</td>
                        <td>
                            <div class="action-btns">
                                <button class="btn btn-small btn-danger" onclick="deleteNews(${news.id})">Fshij</button>
                            </div>
                        </td>
                    `;
                    table.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error loading admin news:', error));
}

// Delete news function
function deleteNews(id) {
    if (confirm('Jeni i sigurt që doni të fshini këtë lajm?')) {
        const formData = new FormData();
        formData.append('action', 'delete_news');
        formData.append('id', id);

        fetch('api.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const message = document.getElementById('adminMessage');
            if (data.success) {
                message.className = 'success';
                message.textContent = data.message;
                message.style.display = 'block';
                
                // Reload all content
                loadHeroNews();
                loadCarousel();
                loadAllNews();
                loadActivities();
                loadStudents();
                loadAdminNews();
                
                setTimeout(() => {
                    message.style.display = 'none';
                }, 3000);
            } else {
                message.className = 'error';
                message.textContent = data.message;
                message.style.display = 'block';
            }
        })
        .catch(error => {
            const message = document.getElementById('adminMessage');
            message.className = 'error';
            message.textContent = 'Gabim në lidhje me serverin';
            message.style.display = 'block';
        });
    }
}

// Contact form submit
function submitContact(event) {
    event.preventDefault();
    alert('Faleminderit! Mesazhi juaj u dërgua me sukses. Do t\'ju kontaktojmë së shpejti.');
    event.target.reset();
}

// Horoscope data - Zodiacs (Stored in LocalStorage for dynamic changes)
let zodiacSigns = JSON.parse(localStorage.getItem('dynamic_zodiacs')) || [
    { name: 'Dashi', dateRange: '21 Mars - 19 Prill', emoji: '♈', description: 'Sot është dita juaj për të marrë vendime të gutshmëra. Përqendrohuni në objektivat tuaja dhe mos u lejoni nga pengesat.' },
    { name: 'Demi', dateRange: '20 Prill - 20 Maj', emoji: '♉', description: 'Yjet ju favorizojnë për romancë dhe lidhje personale. Kjo mund të jetë një ditë e mirë për të marrë rreziqe në dashuri.' },
    { name: 'Binjakët', dateRange: '21 Maj - 20 Qershor', emoji: '♊', description: 'Komunikimi është çelësi juaj sot. Shprehni idetë tuaja dhe dëgjoni atë që kanë për të thënë të tjerët.' },
    { name: 'Gaforrja', dateRange: '21 Qershor - 22 Korrik', emoji: '♋', description: 'Mbrojeni shpirtit tuaj dhe nuk hapni durrin shpejt. Besoni në instinktit tuaj - ai nuk do t\'ju mashtroj.' },
    { name: 'Luani', dateRange: '23 Korrik - 22 Gusht', emoji: '♌', description: 'Kjo është koha juaj për të rrezikuar! Favorizat planet për ndërmarrje dhe lidershipin. Bëhuni qendër vëmendjes.' },
    { name: 'Virgjëresha', dateRange: '23 Gusht - 22 Shtator', emoji: '♍', description: 'Përqendrohuni në detaje sot. Analiza juaj e mprehtë do t\'ju ndihmojë të zgjidhni problemet që ka rreth jush.' },
    { name: 'Peshorja', dateRange: '23 Shtator - 22 Tetor', emoji: '♎', description: 'Balancimi i përsosur është atë që duhet të kërkoni sot. Vendosni kohe për miqësi dhe lidhje romantike.' },
    { name: 'Akrepi', dateRange: '23 Tetor - 21 Nëntor', emoji: '♏', description: 'Fuqia juaj e transformimit është në pikën më të lartë. Refuzojuni atë që nuk ka më nevojë për juve.' },
    { name: 'Shigjetari', dateRange: '22 Nëntor - 21 Dhjetor', emoji: '♐', description: 'Aventura të reja ju presin! Hapni mendjen ndaj mundësive të reja dhe eksploroni rrugë të panjohura.' },
    { name: 'Bricjapi', dateRange: '22 Dhjetor - 19 Janar', emoji: '♑', description: 'Arritjet e juaja janë brenda arritjeve tuaj. Punoni me disiplinë dhe përcaktim për të arritur objektivat.' },
    { name: 'Ujori', dateRange: '20 Janar - 18 Shkurt', emoji: '♒', description: 'Inovasioni dhe kreativiteti janë me ju. Eksprimoni individualitetin tuaj dhe mos kini frikë të jeni ndryshe.' },
    { name: 'Peshqit', dateRange: '19 Shkurt - 20 Mars', emoji: '♓', description: 'Intuitivi juaj është jashtëzakonisht e fortë sot. Dëgjojni zërin tuaj të brendshëm dhe besoni në ndihen tuaj.' }
];

function saveZodiacs() {
    localStorage.setItem('dynamic_zodiacs', JSON.stringify(zodiacSigns));
    loadHoroscope();
    loadHoroscopePage();
    loadHeroHoroscope();
    loadAdminHoroscope();
}

// Load horoscope on homepage
function loadHoroscope() {
    const horoscopeList = document.getElementById('horoscopeList');
    if (!horoscopeList) return;
    
    horoscopeList.innerHTML = '';
    
    // Show 4 random horoscopes
    const selected = [...zodiacSigns].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    selected.forEach(sign => {
        const item = document.createElement('div');
        item.className = 'horoscope-item';
        item.innerHTML = `
            <h4>${sign.emoji} ${sign.name}</h4>
            <p>${sign.description.substring(0, 60)}...</p>
        `;
        horoscopeList.appendChild(item);
    });
}

// Load horoscope page
function loadHoroscopePage() {
    const horoscopeGrid = document.getElementById('horoscopeGrid');
    if (!horoscopeGrid) return;
    
    horoscopeGrid.innerHTML = '';
    
    zodiacSigns.forEach(sign => {
        const card = document.createElement('div');
        card.className = 'horoscope-card';
        card.innerHTML = `
            <div class="horoscope-card-header">
                <h3>${sign.emoji} ${sign.name}</h3>
                <div class="horoscope-date-range">${sign.dateRange || 'Parashikimi ditor'}</div>
            </div>
            <div class="horoscope-card-body">
                <p>${sign.description}</p>
                <div class="horoscope-mood">
                    <div class="horoscope-mood-item">
                        <div class="horoscope-mood-label">Dashuria</div>
                        <div class="horoscope-mood-value">⭐⭐⭐⭐</div>
                    </div>
                    <div class="horoscope-mood-item">
                        <div class="horoscope-mood-label">Puna</div>
                        <div class="horoscope-mood-value">⭐⭐⭐⭐⭐</div>
                    </div>
                    <div class="horoscope-mood-item">
                        <div class="horoscope-mood-label">Shëndeti</div>
                        <div class="horoscope-mood-value">⭐⭐⭐</div>
                    </div>
                </div>
            </div>
        `;
        horoscopeGrid.appendChild(card);
    });
}

// Load horoscope on hero
function loadHeroHoroscope() {
    const heroHoroscope = document.getElementById('heroHoroscope');
    if (!heroHoroscope) return;
    
    if (zodiacSigns.length > 0) {
        const randomHoroscope = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
        heroHoroscope.innerHTML = `
            <div class="horoscope-info">
                <h4>${randomHoroscope.emoji} ${randomHoroscope.name}</h4>
                <p>${randomHoroscope.description.substring(0, 100)}...</p>
            </div>
            <div class="weather-bottom-half">
                <a href="https://www.accuweather.com/en/al/vlore/6826/weather-today/6826" target="_blank" style="width: 100%; height: 100%; display: block;">
                    <img src="moti.png" alt="Moti" class="weather-static-img">
                </a>
            </div>
        `;
    } else {
        heroHoroscope.innerHTML = `<p>Nuk ka parashikime të disponueshme.</p>`;
    }
}

/* ==========================================================================
   KATEGORIA E RE: MENAXHIMI I HOROSKOPIT (ADMIN PANEL)
   ========================================================================== */
function showAddHoroscope() {
    document.getElementById('addHoroscopeForm').style.display = 'block';
}

function hideAddHoroscope() {
    document.getElementById('addHoroscopeForm').style.display = 'none';
    document.getElementById('horoscopeSignSelect').value = 'Dashi';
    document.getElementById('horoscopeDescription').value = '';
}

function addHoroscope(event) {
    event.preventDefault();
    const signName = document.getElementById('horoscopeSignSelect').value;
    const description = document.getElementById('horoscopeDescription').value;
    const adminMessage = document.getElementById('adminMessage');

    if (!description.trim()) {
        alert('Ju lutem plotësoni parashikimin!');
        return;
    }

    // Emojit përkatëse për çdo shenjë
    const emojis = {
        'Dashi': '♈', 'Demi': '♉', 'Binjakët': '♊', 'Gaforrja': '♋',
        'Luani': '♌', 'Virgjëresha': '♍', 'Peshorja': '♎', 'Akrepi': '♏',
        'Shigjetari': '♐', 'Bricjapi': '♑', 'Ujori': '♒', 'Peshqit': '♓'
    };

    // Kontrollojmë nëse shenja ekziston për ta përditësuar, ose e shtojmë si të re
    const existingIndex = zodiacSigns.findIndex(z => z.name.toLowerCase() === signName.toLowerCase());
    
    if (existingIndex !== -1) {
        zodiacSigns[existingIndex].description = description;
    } else {
        zodiacSigns.push({
            name: signName,
            dateRange: 'Shtuar nga Admin',
            emoji: emojis[signName] || '',
            description: description
        });
    }

    saveZodiacs();
    hideAddHoroscope();

    if (adminMessage) {
        adminMessage.className = 'success';
        adminMessage.textContent = 'Horoskopi u përditësua/shtua me sukses!';
        adminMessage.style.display = 'block';
        setTimeout(() => { adminMessage.style.display = 'none'; }, 3000);
    }
}

function loadAdminHoroscope() {
    const table = document.getElementById('adminHoroscopeTable');
    if (!table) return;
    table.innerHTML = '';

    zodiacSigns.forEach((sign, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${sign.emoji} ${sign.name}</strong></td>
            <td>${sign.description.substring(0, 70)}...</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-small btn-danger" onclick="deleteHoroscope(${index})">Fshij</button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });
}

function deleteHoroscope(index) {
    if (confirm('Jeni i sigurt që doni të fshini këtë parashikim horoskopi?')) {
        zodiacSigns.splice(index, 1);
        saveZodiacs();
        
        const adminMessage = document.getElementById('adminMessage');
        if (adminMessage) {
            adminMessage.className = 'success';
            adminMessage.textContent = 'Parashikimi u fshi me sukses!';
            adminMessage.style.display = 'block';
            setTimeout(() => { adminMessage.style.display = 'none'; }, 3000);
        }
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const adminModal = document.getElementById('adminModal');
    if (event.target == loginModal) {
        closeModal();
    }
    if (event.target == adminModal) {
        closeAdminPanel();
    }
}

/* ==========================================================================
   ===== SUDOKU GAME (INTERAKTIV) =====
   ========================================================================== */
let sudokuGrid = [];
let sudokuOriginal = [];
let sudokuSolved = [];

function generateSudoku() {
    sudokuOriginal = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];
    
    sudokuSolved = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];
    
    sudokuGrid = JSON.parse(JSON.stringify(sudokuOriginal));
    renderSudokuBoard();
}

function renderSudokuBoard() {
    const board = document.getElementById('sudokuBoard');
    if(!board) return;
    board.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.id = `sudoku-${i}-${j}`;
            
            if (sudokuOriginal[i][j] !== 0) {
                cell.classList.add('readonly');
                cell.textContent = sudokuOriginal[i][j];
                cell.style.fontWeight = '700';
                cell.style.backgroundColor = '#f0f0f0';
            } else {
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '1';
                input.max = '9';
                input.className = 'sudoku-input';
                input.value = sudokuGrid[i][j] !== 0 ? sudokuGrid[i][j] : '';
                input.dataset.row = i;
                input.dataset.col = j;
                
                // Përmirësimi i input-it
                input.addEventListener('input', function(e) {
                    let val = e.target.value;
                    
                    // Nëse futet më shumë se një shifër, mbajmë vetëm të fundit
                    if (val.length > 1) {
                        val = val.slice(-1);
                        e.target.value = val;
                    }

                    if (val === '') {
                        sudokuGrid[i][j] = 0;
                    } else if (/^[1-9]$/.test(val)) {
                        sudokuGrid[i][j] = parseInt(val);
                        // Lëvizja automatike te qeliza tjetër (opsionale)
                        // moveToNextCell(i, j); 
                    } else {
                        // Nëse s'është 1-9, e fshijmë
                        e.target.value = sudokuGrid[i][j] !== 0 ? sudokuGrid[i][j] : '';
                    }
                });
                
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowRight' && j < 8) {
                        const nextCell = document.getElementById(`sudoku-${i}-${j+1}`);
                        if (nextCell) {
                            const inp = nextCell.querySelector('input');
                            if (inp) inp.focus();
                        }
                    } else if (e.key === 'ArrowLeft' && j > 0) {
                        const prevCell = document.getElementById(`sudoku-${i}-${j-1}`);
                        if (prevCell) {
                            const inp = prevCell.querySelector('input');
                            if (inp) inp.focus();
                        }
                    } else if (e.key === 'ArrowDown' && i < 8) {
                        const downCell = document.getElementById(`sudoku-${i+1}-${j}`);
                        if (downCell) {
                            const inp = downCell.querySelector('input');
                            if (inp) inp.focus();
                        }
                    } else if (e.key === 'ArrowUp' && i > 0) {
                        const upCell = document.getElementById(`sudoku-${i-1}-${j}`);
                        if (upCell) {
                            const inp = upCell.querySelector('input');
                            if (inp) inp.focus();
                        }
                    }
                });
                
                cell.appendChild(input);
            }
            board.appendChild(cell);
        }
    }
}

function checkSudokuSolution() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (sudokuGrid[i][j] !== sudokuSolved[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function verifySudoku() {
    if (checkSudokuSolution()) {
        alert('🎉 Përgëzime! Zgjidhje e saktë! 🎉');
    } else {
        alert('❌ Ka gabime në zgjidhjen tuaj. Provoni përsëri!');
    }
}

function clearSudoku() {
    sudokuGrid = JSON.parse(JSON.stringify(sudokuOriginal));
    renderSudokuBoard();
}

/* ==========================================================================
   ===== DAILY RIDDLES =====
   ========================================================================== */
const dailyRiddles = [
    { question: "Kam qytete, por jo shtëpi. Unë kam male, por jo pemë. Unë kam ujë, por jo peshk. Çfarë jam unë??", answer: "Harta" },
    { question: "Kam samar po nuk jam gomar.Çfarë jam?", answer: "Breshka'" },
    { question: "Sa shkronja ka në alfabeti?", answer: "Ka 8 shkronja në fjalën alfabeti" },
    { question: "Jam i gjatë kur jam i ri, jam i shkurtër kur plakëm, cfare jam unë?", answer: "Qiriri" },
    { question: " E di çfarë mund të mbash pa e prekur kurrë?", answer: "Muhabetin" },
    { question: "Cila ndërtesë ka më shumë histori?", answer: "Bibloteka" },
    { question: " Babai i Tonit ka 3 djem: Tini, Tani dhe si është emri i djalit të tretë?", answer: "Toni" },
    { question: "Çfarë mund të mbushë një dhomë, por nuk kërkon hapsirë?", answer: "Drita" },
    { question: "Çfarë ka në mesin e Parisit?", answer: "Shkronja 'R'" },
    { question: "Sa muaj të vitit i kanë nga 28 ditë?", answer: "Te gjithe muajt kane 28 dite" }
];

let currentRiddleIndex = Math.floor(Math.random() * dailyRiddles.length);

function loadDailyRiddle() {
    const riddle = dailyRiddles[currentRiddleIndex];
    const riddleSection = document.querySelector('.riddles-section');
    
    if (riddleSection) {
        riddleSection.innerHTML = `
            <div class="riddle-container-top">
                <h2>Gjëegjëza e Ditës</h2>
                <div class="riddle-card">
                    <div class="riddle-content">
                        <h3 id="riddleQuestion">${riddle.question}</h3>
                        <button class="reveal-btn" onclick="toggleRiddleAnswer()">Zbuloni Përgjigjen</button>
                        <div id="riddleAnswer" class="riddle-answer" style="display: none;">
                            <p id="riddleText">${riddle.answer}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="books-container-bottom">
                <div class="books-label">Librat më të shitur</div>
                <div class="books-image-wrapper">
                    <img src="librat.png" alt="Librat më të shitur">
                    <a href="https://www.amazon.com/dp/0063415895?tag=thenewyorktim-20" target="_blank" class="book-link left"></a>
                    <a href="https://www.amazon.com/dp/B0G1M3RCVT?tag=thenewyorktim-20" target="_blank" class="book-link right"></a>
                </div>
            </div>
        `;
    }
}

function toggleRiddleAnswer() {
    const answer = document.getElementById('riddleAnswer');
    if (!answer) return;
    if (answer.style.display === 'none') {
        answer.style.display = 'block';
    } else {
        answer.style.display = 'none';
    }
}