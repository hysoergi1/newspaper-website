<!DOCTYPE html>
<html lang="sq">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Universiteti Ismail Qemali</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .hero-container-flex { display: flex; gap: 20px; align-items: stretch; }
        .hero-main-left { flex: 2; display: flex; background: #0056b3; color: white; border-radius: 8px; overflow: hidden; } /* Ngjyra blu majtas */
        .hero-horoscope-box { flex: 1; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; color: #333; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .faded-banner-section { width: 100%; height: 200px; background-image: url('rruga/per/tek/fotoja.jpg'); background-size: cover; background-position: center; opacity: 0.35; margin: 30px 0; }
        .games-and-riddles-footer { display: flex; gap: 20px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        .games-and-riddles-footer section { flex: 1; background: #f9f9f9; padding: 20px; border-radius: 8px; }
        
        /* Stilimi për Tabs brenda Admin Panel */
        .admin-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .admin-tab-btn { background: #e0e0e0; color: #333; border: none; padding: 10px 20px; cursor: pointer; border-radius: 6px; font-weight: 500; }
        .admin-tab-btn.active { background: #0056b3; color: white; }
    </style>
</head>
<body>
    <div class="top-bar">
        <div class="container">
            <div class="top-bar-left"> 
                <a href="mailto:fshtn@univlora.edu.al">fshtn@univlora.edu.al</a>
                <a href="tel:+355332224952">+355 33 222 4952</a> 
            </div>
            <div class="top-bar-right">
                <span id="dynamic-date"><?php echo date('d/m/Y'); ?></span>
            </div>
        </div>
    </div>

    <nav>
        <div class="container">
            <div class="logo">
                <img src="logo.jpg" alt="Logo">
                <div class="logo-text">
                    <h1>Universiteti Ismail Qemali</h1>
                    <p>Gazeta Universitare</p>
                </div>
            </div>
            <ul>
                <li><a href="#" class="nav-link active" data-page="kryefaqja">Kryefaqja</a></li>
                <li><a href="#" class="nav-link" data-page="lajme">Lajme</a></li>
                <li><a href="#" class="nav-link" data-page="horoscope">Horoskopi</a></li>
                <li><a href="#" class="nav-link" data-page="aktivitete">Aktivitete</a></li>
                <li><a href="#" class="nav-link" data-page="studente">Studentë</a></li>
                <li><a href="#" class="nav-link" data-page="kontakt">Kontakt</a></li>
                <li><a href="#" class="login-btn" onclick="openModal(); return false;">Log In</a></li>
            </ul>
        </div>
    </nav>

    <div id="kryefaqja" class="page-content active">
      
        <section class="hero-news">
            <div class="container hero-container-flex">
                
                <div class="hero-main-left">
                    <div class="hero-content" style="padding: 30px; flex: 1;">
                        <span class="hero-badge" id="heroBadge">E FUNDIT</span>
                        <h2 id="heroTitle">Duke ngarkuar...</h2>
                        <p id="heroContent">Ju lutemi prisni...</p>
                        <div class="hero-meta" id="heroMeta"></div>
                        <a href="#" class="hero-btn" id="heroBtn" style="color: #000; text-decoration: none;">Lexo më tej</a>
                    </div>
                    <div class="hero-image" style="flex: 1;">
                        <img id="heroImage" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect fill='%23ffffff' width='600' height='400'/></svg>" alt="Latest News" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>

                <div class="hero-horoscope-box">
                    <div class="hero-sidebar-title" style="border-bottom: 2px solid #0056b3; padding-bottom: 10px; margin-bottom: 15px;">
                        <span style="font-weight: bold; font-size: 18px;">Horoskopi</span>
                    </div>
                    <div class="hero-sidebar-content" id="heroHoroscope">
                        <p style="color: #222; font-weight: 500;">Lajmet e fundit të horoskopit:</p>
                        <div id="latestHoroscopeNews">
                            <p style="color: #666; font-size: 14px;">Duke ngarkuar parashikimet ditore...</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <section class="news-carousel">
            <div class="carousel-container">
                <div class="carousel-title">
                    <h2>Lajmet e Fundit</h2>
                    <p>Mbani veten të informuar me ngjarjet dhe arritjet më të fundit</p>
                </div>
                <div class="carousel-wrapper">
                    <div class="carousel-track" id="carouselTrack">
                        </div>
                </div>
                <div class="carousel-nav" id="carouselNav">
                    </div>
            </div>
        </section>

        <div class="container games-and-riddles-footer">
            <section class="games-section">
                <div class="games-container">
                    <h2>🎮 Loja: Sudoku</h2>
                    <p style="margin-bottom: 20px; color: #666; font-size: 14px;">Zhvillo mendjen tuaj! Plotëso tabelën e Sudoku-t</p>
                    <div class="sudoku-container">
                        <div id="sudokuBoard" class="sudoku-board">
                            </div>
                        <div class="sudoku-controls" style="margin-top: 15px;">
                            <button class="btn" onclick="generateSudoku()">Lojë e Re</button>
                            <button class="btn" style="background: #28a745;" onclick="verifySudoku()">Verifiko Zgjidhjen</button>
                            <button class="btn" style="background: #6c757d;" onclick="clearSudoku()">Pastro</button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="riddles-section">
                <div class="riddles-container">
                    <h2>❓ Gjëegjëza e Ditës</h2>
                    <div class="riddle-card" id="riddleCard" style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd;">
                        <div class="riddle-content">
                            <h3 id="riddleQuestion" style="font-size: 16px; margin-bottom: 15px;">Duke ngarkuar gjëegjëzën...</h3>
                            <button class="reveal-btn" onclick="toggleRiddleAnswer()" style="padding: 6px 12px; cursor: pointer;">Zbulo Përgjigjen</button>
                            <div class="riddle-answer" id="riddleAnswer" style="display: none; margin-top: 15px; color: green; font-weight: bold;">
                                <p id="riddleText"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>

    <div id="lajme" class="page-content">
        <div class="page-header">
            <h2>Lajme & Artikuj</h2>
            <p>Mbani veten të informuar me ngjarjet dhe zhvillimet më të fundit nga universiteti</p>
        </div>
        <section class="news-section">
            <div class="news-grid" id="newsGrid"></div>
        </section>
    </div>

    <div id="aktivitete" class="page-content">
        <div class="page-header">
            <h2>Aktivitete & Ngjarje</h2>
            <p>Zbuloni aktivitetet, workshopet dhe ngjarjet që zhvillohen në universitet</p>
        </div>
        <section class="news-section">
            <div class="activities-grid" id="activitiesGrid"></div>
        </section>
    </div>

    <div id="studente" class="page-content">
        <div class="page-header">
            <h2>Për Studentët</h2>
            <p>Informacione dhe resurse për studentët tanë</p>
        </div>
        <section class="students-section">
            <div class="container">
                <div class="news-grid" id="studentsGrid"></div>
            </div>
        </section>
    </div>

    <div id="kontakt" class="page-content">
        <div class="page-header">
            <h2>Na Kontaktoni</h2>
            <p>Keni pyetje? Na shkruani dhe do t'ju përgjigemi sa më shpejt të jetë e mundur</p>
        </div>
        <section class="contact-section">
            <div class="contact-container">
                <div class="contact-info">
                    <h3>Informacione Kontakti</h3>
                    <div class="contact-item"><div class="contact-icon">📍</div><div><strong>Adresa</strong><br>Sheshi "Pavarësia", Skelë, Vlorë 9400, Shqipëri</div></div>
                    <div class="contact-item"><div class="contact-icon">📞</div><div><strong>Telefon</strong><br>+355 33 222 4952</div></div>
                    <div class="contact-item"><div class="contact-icon">✉️</div><div><strong>Email</strong><br>fshtn@univlora.edu.al</div></div>
                </div>
                <div class="contact-form">
                    <h3 style="margin-bottom: 25px;">Dërgoni një Mesazh</h3>
                    <form onsubmit="submitContact(event)">
                        <div class="form-group"><label>Emri i plotë</label><input type="text" required placeholder="Shkruani emrin tuaj"></div>
                        <div class="form-group"><label>Email</label><input type="email" required placeholder="email@example.com"></div>
                        <div class="form-group"><label>Subjekti</label><input type="text" required placeholder="Për çfarë dëshironi të na kontaktoni?"></div>
                        <div class="form-group"><label>Mesazhi</label><textarea required placeholder="Shkruani mesazhin tuaj këtu..."></textarea></div>
                        <button type="submit" class="submit-btn">Dërgo Mesazhin</button>
                    </form>
                </div>
            </div>
        </section>
    </div>

    <div id="horoscope" class="page-content">
        <div class="page-header">
            <h2>Horoskopi</h2>
            <p>Zbuloni parashikimet e astrologjisë për secilën shenjë të zodiakut.</p>
        </div>
        <section class="horoscope-page-section">
            <div class="container">
                <div class="horoscope-grid" id="horoscopeGrid"></div>
            </div>
        </section>
    </div>

    <footer>
        <div class="footer-content">
            <div>
                <h3>Universiteti Ismail Qemali</h3>
                <p>Fakulteti i Shkencave Teknike dhe Natyrore, Universiteti "Ismail Qemali" Vlorë.</p>
            </div>
            <div>
                <h3>Lidhje të Shpejta</h3>
                <a href="#" onclick="showPage('lajme'); return false;">Lajme</a>
                <a href="#" onclick="showPage('aktivitete'); return false;">Aktivitete</a>
                <a href="#" onclick="showPage('studente'); return false;">Studentë</a>
                <a href="#" onclick="showPage('kontakt'); return false;">Kontakt</a>
                <a href="#" onclick="showPage('horoscope'); return false;">Horoskopi</a>
            </div>
            <div>
                <h3>Kontakt</h3>
                <p>Sheshi "Pavarësia", Skelë, Vlorë 9400, Shqipëri</p>
            </div>
        </div>
        <div class="copyright">
            © 2026 Universiteti "Ismail Qemali" Vlorë - Fakulteti i Shkencave Teknike dhe Natyrore
        </div>
    </footer>

    <div id="loginModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Paneli i Administratorit</h2>
            <div id="message"></div>
            <form id="loginForm" onsubmit="login(event)">
                <div class="form-group"><label>Përdoruesi</label><input type="text" id="username" required></div>
                <div class="form-group"><label>Fjalëkalimi</label><input type="password" id="password" required></div>
                <button type="submit" class="btn" style="width: 100%;">Hyni</button>
            </form>
        </div>
    </div>

    <div id="adminModal" class="modal">
        <div class="modal-content" style="max-width: 900px; max-height: 85vh; overflow-y: auto;">
            <span class="close" onclick="closeAdminPanel()">&times;</span>
            
            <div class="admin-tabs">
                <button class="admin-tab-btn active" data-target="admin-news-section">Menaxho Lajmet</button>
                <button class="admin-tab-btn" data-target="admin-horoscope-section">Menaxho Horoskopin</button>
            </div>

            <div id="adminMessage"></div>

            <div id="admin-news-section" class="admin-section-content">
                <div class="admin-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3>Lista e Lajmeve dhe Aktiviteteve</h3>
                    <button class="btn" onclick="showAddNews()">Shto Lajm të Ri</button>
                </div>
                
                <div id="addNewsForm" style="display: none; margin-bottom: 30px; background: #f8f9fa; padding: 25px; border-radius: 12px;">
                    <h3>Shto Lajm të Ri</h3>
                    <form onsubmit="addNews(event)">
                        <div class="form-group"><label>Titulli</label><input type="text" id="newsTitle" required></div>
                        <div class="form-group"><label>Përmbajtja</label><textarea id="newsContent" required style="min-height: 120px;"></textarea></div>
                        <div class="form-group">
                            <label>Kategoria</label>
                            <select id="newsCategory">
                                <option value="lajm">Lajm</option>
                                <option value="aktivitet">Aktivitet</option>
                                <option value="studente">Studentë</option>
                            </select>
                        </div>
                        <div class="form-group"><label>URL e Imazhit</label><input type="text" id="newsImage" placeholder="https://example.com/image.jpg"></div>
                        <div style="display: flex; gap: 10px;">
                            <button type="submit" class="btn">Publiko</button>
                            <button type="button" class="btn" style="background: #6c757d;" onclick="hideAddNews()">Anulo</button>
                        </div>
                    </form>
                </div>

                <table class="news-table">
                    <thead>
                        <tr><th>Titulli</th><th>Kategoria</th><th>Data</th><th>Veprime</th></tr>
                    </thead>
                    <tbody id="adminNewsTable"></tbody>
                </table>
            </div>

            <div id="admin-horoscope-section" class="admin-section-content" style="display: none;">
                <div class="admin-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3>Menaxhimi i Horoskopit Dinamik</h3>
                    <button class="btn" style="background: #28a745;" onclick="showAddHoroscope()">Shto / Përditëso Parashikim</button>
                </div>

                <div id="addHoroscopeForm" style="display: none; margin-bottom:30px; background: #f8f9fa; padding:25px; border-radius:12px;">
                    <h3>Përditëso Parashikim Horoskopi</h3>
                    <form onsubmit="addHoroscope(event)">
                        <div class="form-group">
                            <label>Zgjidh Shenjën:</label>
                            <select id="horoscopeSignSelect" style="width:100%; padding:8px; border-radius:6px; border:1px solid #ddd;">
                                <option value="Dashi">Dashi</option>
                                <option value="Demi">Demi</option>
                                <option value="Binjakët">Binjakët</option>
                                <option value="Gaforrja">Gaforrja</option>
                                <option value="Luani">Luani</option>
                                <option value="Virgjëresha">Virgjëresha</option>
                                <option value="Peshorja">Peshorja</option>
                                <option value="Akrepi">Akrepi</option>
                                <option value="Shigjetari">Shigjetari</option>
                                <option value="Bricjapi">Bricjapi</option>
                                <option value="Ujori">Ujori</option>
                                <option value="Peshqit">Peshqit</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Parashikimi i Ri:</label>
                            <textarea id="horoscopeDescription" required style="width:100%; min-height:100px; padding:8px; border-radius:6px; border:1px solid #ddd;" placeholder="Shkruaj parashikimin ditor këtu..."></textarea>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button type="submit" class="btn" style="background: #28a745;">Ruaj</button>
                            <button type="button" class="btn" style="background: #6c757d;" onclick="hideAddHoroscope()">Anulo</button>
                        </div>
                    </form>
                </div>

                <table class="news-table">
                    <thead>
                        <tr><th>Shenja</th><th>Parashikimi Aktual</th><th>Veprime</th></tr>
                    </thead>
                    <tbody id="adminHoroscopeTable"></tbody>
                </table>
            </div>

        </div>
    </div>

    <script src="js/main.js"></script>
</body>
</html>