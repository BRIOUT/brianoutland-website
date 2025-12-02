// ============================================
// CYBERSECURITY PORTFOLIO - script.js
// Complete Final Version - No Errors
// ============================================

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website loaded!');

    // Initialize all features
    initTheme();
    initMobileMenu();
    loadCertifications();
    loadBootcampProjects();
    loadProjects();
    loadBugBounties();
    loadCTF();
    initContactForm();
    initProjectModal();
});

// ============================================
// THEME TOGGLE (Dark/Light Mode)
// ============================================

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');

    if (!themeToggle) {
        console.log('Theme toggle not found');
        return;
    }

    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme') || 'dark';

    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeIcon) updateThemeIcon(themeIcon, savedTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (themeIcon) updateThemeIcon(themeIcon, newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (!mobileMenuBtn || !navMenu) {
        console.log('Mobile menu elements not found');
        return;
    }

    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// LOAD CERTIFICATIONS
// ============================================

async function loadCertifications() {
    const container = document.getElementById('certifications-container');

    if (!container) {
        console.error('Certifications container not found');
        return;
    }

    try {
        const response = await fetch('./data/certifications.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Certifications loaded:', data);
        renderCertifications(data.certifications);

    } catch (error) {
        console.error('Error loading certifications:', error);
        console.log('Using sample data instead');
        renderCertifications(getSampleCertifications());
    }
}

function renderCertifications(certifications) {
    const container = document.getElementById('certifications-container');

    if (!certifications || certifications.length === 0) {
        container.innerHTML = '<p class="loading">No certifications to display.</p>';
        return;
    }

    container.innerHTML = certifications.map(cert => `
        <div class="card fade-in">
            <div class="card-title">${cert.name}</div>
            <div class="card-subtitle">
                <i class="fas fa-building"></i> ${cert.issuer} |
                <i class="fas fa-calendar"></i> ${cert.date}
            </div>
            <div class="card-content">
                <p>${cert.description}</p>
                <div class="tags">
                    ${cert.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                ${cert.verifyUrl ? `
                    <a href="${cert.verifyUrl}" target="_blank" class="btn btn-verify" style="margin-top: 1rem; display: inline-flex;">
                        <i class="fas fa-external-link-alt"></i>
                        <span>Verify Certificate</span>
                    </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// ============================================
// LOAD BOOTCAMP PROJECTS
// ============================================

async function loadBootcampProjects() {
    const container = document.getElementById('bootcamp-projects-container');

    if (!container) {
        console.error('Bootcamp projects container not found');
        return;
    }

    try {
        const response = await fetch('./data/bootcamp-projects.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Bootcamp projects loaded:', data);
        renderBootcampProjects(data.projects);

    } catch (error) {
        console.error('Error loading bootcamp projects:', error);
        console.log('Using sample data instead');
        renderBootcampProjects(getSampleBootcampProjects());
    }
}

function renderBootcampProjects(projects) {
    const container = document.getElementById('bootcamp-projects-container');

    if (!projects || projects.length === 0) {
        container.innerHTML = '<p class="loading">No bootcamp projects to display yet.</p>';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="card expandable-card fade-in ${project.featured ? 'featured-project' : ''}">
            <button class="expand-toggle" onclick="toggleExpand('bootcamp-${project.id}')">
                <div style="flex: 1;">
                    <div class="card-title">
                        ${project.title}
                        ${project.featured ? '<i class="fas fa-star" style="color: #fbbf24; margin-left: 0.5rem;"></i>' : ''}
                        <span class="badge badge-${project.status === 'Completed' ? 'success' : project.status === 'In Progress' ? 'warning' : 'info'}">
                            ${project.status}
                        </span>
                    </div>
                    <div class="card-subtitle">${project.description}</div>
                </div>
                <i class="fas fa-chevron-down expand-icon" id="icon-bootcamp-${project.id}"></i>
            </button>

            <div class="expanded-content" id="content-bootcamp-${project.id}">
                <div class="card-content">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <h4><i class="fas fa-user"></i> Role</h4>
                            <p>${project.role}</p>
                        </div>
                        <div>
                            <h4><i class="fas fa-users"></i> Team</h4>
                            <p>${project.teamSize}</p>
                        </div>
                        <div>
                            <h4><i class="fas fa-clock"></i> Duration</h4>
                            <p>${project.duration}</p>
                        </div>
                    </div>

                    <h4><i class="fas fa-tools"></i> Technologies</h4>
                    <div class="tags">
                        ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                    </div>

                    <h4><i class="fas fa-list-check"></i> Key Features</h4>
                    <ul style="margin-left: 1.5rem; margin-bottom: 1rem; color: var(--text-secondary);">
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>

                    <h4><i class="fas fa-mountain"></i> Challenges</h4>
                    <p>${project.challenges}</p>

                    <h4><i class="fas fa-lightbulb"></i> Key Learnings</h4>
                    <p>${project.learnings}</p>

                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
                        ${project.projectFile || project.liveUrl ? `
                            <button onclick='openProjectModal(${JSON.stringify(project).replace(/'/g, "&#39;")})' class="btn btn-view-project">
                                <i class="fas fa-eye"></i>
                                <span>View Project</span>
                            </button>
                        ` : ''}
                        ${project.githubUrl ? `
                            <a href="${project.githubUrl}" target="_blank" class="btn btn-verify">
                                <i class="fab fa-github"></i>
                                <span>View Code</span>
                            </a>
                        ` : ''}
                        ${project.liveUrl && !project.projectFile ? `
                            <a href="${project.liveUrl}" target="_blank" class="btn btn-verify">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Live Demo</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// LOAD PROJECTS
// ============================================

async function loadProjects() {
    const container = document.getElementById('projects-container');

    if (!container) {
        console.error('Projects container not found');
        return;
    }

    try {
        const response = await fetch('./data/projects.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Projects loaded:', data);
        renderProjects(data.projects);

    } catch (error) {
        console.error('Error loading projects:', error);
        console.log('Using sample data instead');
        renderProjects(getSampleProjects());
    }
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');

    if (!projects || projects.length === 0) {
        container.innerHTML = '<p class="loading">No projects to display.</p>';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="card expandable-card fade-in">
            <button class="expand-toggle" onclick="toggleExpand('project-${project.id}')">
                <div style="flex: 1;">
                    <div class="card-title">
                        ${project.title}
                        <span class="badge badge-${project.status === 'Completed' ? 'success' : 'warning'}">
                            ${project.status}
                        </span>
                    </div>
                    <div class="card-subtitle">${project.objective}</div>
                </div>
                <i class="fas fa-chevron-down expand-icon" id="icon-project-${project.id}"></i>
            </button>

            <div class="expanded-content" id="content-project-${project.id}">
                <div class="card-content">
                    <h4><i class="fas fa-clipboard-list"></i> Methodology</h4>
                    <p>${project.methodology}</p>

                    <h4><i class="fas fa-tools"></i> Tools Used</h4>
                    <div class="tags">
                        ${project.tools.map(tool => `<span class="tag">${tool}</span>`).join('')}
                    </div>

                    <h4><i class="fas fa-lightbulb"></i> Key Learnings</h4>
                    <p>${project.learnings}</p>

                    <div class="tags">
                        ${project.tags.map(tag => `<span class="badge badge-info">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// LOAD BUG BOUNTIES
// ============================================

async function loadBugBounties() {
    try {
        const response = await fetch('./data/bugbounties.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Bug bounties loaded:', data);
        renderBountyStats(data.statistics);
        renderBugBounties(data.submissions);

    } catch (error) {
        console.error('Error loading bug bounties:', error);
        console.log('Using sample data instead');
        const sampleData = getSampleBugBounties();
        renderBountyStats(sampleData.statistics);
        renderBugBounties(sampleData.submissions);
    }
}

function renderBountyStats(stats) {
    const container = document.getElementById('bounty-stats');

    if (!container) {
        console.error('Bounty stats container not found');
        return;
    }

    container.innerHTML = `
        <div class="stat-card fade-in">
            <div class="stat-number">${stats.totalSubmissions}</div>
            <div class="stat-label">Total Submissions</div>
        </div>
        <div class="stat-card fade-in">
            <div class="stat-number">${stats.resolvedSubmissions}</div>
            <div class="stat-label">Resolved</div>
        </div>
        <div class="stat-card fade-in">
            <div class="stat-number">${stats.totalEarnings}</div>
            <div class="stat-label">Total Earned</div>
        </div>
        <div class="stat-card fade-in">
            <div class="stat-number">${stats.severities.critical}</div>
            <div class="stat-label">Critical Bugs</div>
        </div>
    `;
}

function renderBugBounties(bounties) {
    const container = document.getElementById('bounties-container');

    if (!container) {
        console.error('Bounties container not found');
        return;
    }

    if (!bounties || bounties.length === 0) {
        container.innerHTML = '<p class="loading">No bug bounties to display.</p>';
        return;
    }

    container.innerHTML = bounties.map(bounty => `
        <div class="card expandable-card fade-in">
            <button class="expand-toggle" onclick="toggleExpand('bounty-${bounty.id}')">
                <div style="flex: 1;">
                    <div class="card-title">
                        ${bounty.title}
                        <span class="badge badge-${getSeverityClass(bounty.severity)}">${bounty.severity}</span>
                        <span class="badge badge-${getStatusClass(bounty.status)}">${bounty.status}</span>
                    </div>
                    <div class="card-subtitle">
                        <i class="fas fa-shield-alt"></i> ${bounty.program} |
                        <i class="fas fa-dollar-sign"></i> ${bounty.bounty} |
                        CVSS: ${bounty.cvss}
                    </div>
                </div>
                <i class="fas fa-chevron-down expand-icon" id="icon-bounty-${bounty.id}"></i>
            </button>

            <div class="expanded-content" id="content-bounty-${bounty.id}">
                <div class="card-content">
                    <p>${bounty.description}</p>

                    <h4><i class="fas fa-bug"></i> Vulnerability Type</h4>
                    <span class="badge badge-danger">${bounty.vulnerability}</span>

                    <h4><i class="fas fa-exclamation-triangle"></i> Impact</h4>
                    <p>${bounty.impact}</p>

                    <h4><i class="fas fa-search"></i> How I Found It</h4>
                    <p>${bounty.discovery}</p>

                    <h4><i class="fas fa-wrench"></i> Remediation</h4>
                    <p>${bounty.remediation}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// LOAD CTF COMPETITIONS
// ============================================

async function loadCTF() {
    try {
        const response = await fetch('./data/ctf.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('CTF data loaded:', data);
        renderCTFStats(data.statistics);
        renderCTF(data.competitions);

    } catch (error) {
        console.error('Error loading CTF:', error);
        console.log('Using sample data instead');
        const sampleData = getSampleCTF();
        renderCTFStats(sampleData.statistics);
        renderCTF(sampleData.competitions);
    }
}

function renderCTFStats(stats) {
    const container = document.getElementById('ctf-stats');

    if (!container) {
        console.error('CTF stats container not found');
        return;
    }

    container.innerHTML = `
        <div class="stat-card fade-in">
            <div class="stat-number">${stats.totalCompetitions}</div>
            <div class="stat-label">Competitions</div>
        </div>
        <div class="stat-card fade-in">
            <div class="stat-number">${stats.totalChallengesSolved}</div>
            <div class="stat-label">Challenges Solved</div>
        </div>
        <div class="stat-card fade-in">
            <div class="stat-number">${stats.totalPoints.toLocaleString()}</div>
            <div class="stat-label">Total Points</div>
        </div>
        <div class="stat-card fade-in">
            <div class="stat-number">${stats.averagePlacement}</div>
            <div class="stat-label">Avg Placement</div>
        </div>
    `;
}

function renderCTF(competitions) {
    const container = document.getElementById('ctf-container');

    if (!container) {
        console.error('CTF container not found');
        return;
    }

    if (!competitions || competitions.length === 0) {
        container.innerHTML = '<p class="loading">No CTF competitions to display.</p>';
        return;
    }

    container.innerHTML = competitions.map(ctf => `
        <div class="card expandable-card fade-in">
            <button class="expand-toggle" onclick="toggleExpand('ctf-${ctf.id}')">
                <div style="flex: 1;">
                    <div class="card-title">
                        ${ctf.name}
                        ${ctf.featured ? '<span class="badge badge-warning">Featured</span>' : ''}
                    </div>
                    <div class="card-subtitle">
                        <i class="fas fa-trophy"></i> ${ctf.placement} |
                        <i class="fas fa-star"></i> ${ctf.score.toLocaleString()} points |
                        Solved ${ctf.challengesSolved}/${ctf.totalChallenges}
                    </div>
                </div>
                <i class="fas fa-chevron-down expand-icon" id="icon-ctf-${ctf.id}"></i>
            </button>

            <div class="expanded-content" id="content-ctf-${ctf.id}">
                <div class="card-content">
                    <h4><i class="fas fa-star"></i> Highlights</h4>
                    <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
                        ${ctf.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>

                    <div class="tags">
                        ${ctf.categories.map(cat => `<span class="tag">${cat}</span>`).join('')}
                    </div>

                    ${ctf.writeups && ctf.writeups.length > 0 ? `
                        <h4><i class="fas fa-book"></i> Challenge Writeups</h4>
                        ${ctf.writeups.map(w => `
                            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem; margin-top: 0.5rem;">
                                <strong>${w.challenge}</strong>
                                <span class="badge badge-${getDifficultyClass(w.difficulty)}">${w.difficulty}</span>
                                <span class="badge badge-info">${w.points} pts</span>
                                <p style="margin-top: 0.5rem;">${w.solution}</p>
                            </div>
                        `).join('')}
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// CONTACT FORM
// ============================================

function initContactForm() {
    const form = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');

    if (!form) {
        console.log('Contact form not found');
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                messageDiv.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                messageDiv.className = 'form-message success';
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }

        } catch (error) {
            console.error('Error sending message:', error);
            messageDiv.textContent = 'Failed to send message. Please try emailing me directly at your.email@example.com';
            messageDiv.className = 'form-message error';
        } finally {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function toggleExpand(id) {
    const content = document.getElementById(`content-${id}`);
    const icon = document.getElementById(`icon-${id}`);

    if (content && icon) {
        content.classList.toggle('show');
        icon.classList.toggle('expanded');
    }
}

function getSeverityClass(severity) {
    const map = {
        'Critical': 'danger',
        'High': 'warning',
        'Medium': 'warning',
        'Low': 'info'
    };
    return map[severity] || 'info';
}

function getStatusClass(status) {
    const map = {
        'Resolved': 'success',
        'Triaged': 'info',
        'Submitted': 'warning'
    };
    return map[status] || 'info';
}

function getDifficultyClass(difficulty) {
    const map = {
        'Hard': 'danger',
        'Medium': 'warning',
        'Easy': 'success'
    };
    return map[difficulty] || 'info';
}

// ============================================
// SAMPLE DATA (Fallback)
// ============================================

function getSampleCertifications() {
    return [
        {
            name: 'Google Cybersecurity Professional Certificate',
            issuer: 'Google / Coursera',
            date: '2024',
            description: 'Comprehensive 8-course program covering cybersecurity foundations, network security, Linux, SQL, Python automation, incident detection and response.',
            tags: ['Cybersecurity', 'Python', 'Linux', 'SIEM'],
            verifyUrl: '#'
        },
        {
            name: 'CompTIA Security+',
            issuer: 'CompTIA',
            date: 'January 2024',
            description: 'Foundational cybersecurity certification covering network security, compliance, and operational security.',
            tags: ['Security', 'Compliance'],
            verifyUrl: '#'
        }
    ];
}

function getSampleProjects() {
    return [
        {
            id: 1,
            title: 'Network Penetration Testing Lab',
            objective: 'Build a virtualized network environment to practice penetration testing',
            methodology: 'Created isolated VMs using VirtualBox with vulnerable machines',
            tools: ['Kali Linux', 'Metasploit', 'Nmap', 'Wireshark'],
            learnings: 'Gained hands-on experience with reconnaissance and exploitation',
            status: 'Completed',
            tags: ['Pentesting', 'Network Security']
        }
    ];
}

function getSampleBugBounties() {
    return {
        statistics: {
            totalSubmissions: 3,
            resolvedSubmissions: 2,
            totalEarnings: '$3,250',
            severities: { critical: 1, high: 1, medium: 1 }
        },
        submissions: [
            {
                id: 1,
                title: 'XSS in User Profile',
                program: 'HackerOne - Example Company',
                severity: 'High',
                cvss: '7.4',
                status: 'Resolved',
                bounty: '$500',
                vulnerability: 'Stored XSS',
                description: 'Discovered stored XSS vulnerability in user profile bio field',
                impact: 'Account takeover and session hijacking possible',
                discovery: 'Found while testing input validation on profile fields',
                remediation: 'Implemented DOMPurify library and CSP headers'
            }
        ]
    };
}

function getSampleCTF() {
    return {
        statistics: {
            totalCompetitions: 3,
            totalChallengesSolved: 45,
            totalPoints: 26450,
            averagePlacement: 'Top 10%'
        },
        competitions: [
            {
                id: 1,
                name: 'HackTheBox University CTF 2024',
                organizer: 'HackTheBox',
                placement: '45th out of 500',
                score: 8750,
                challengesSolved: 12,
                totalChallenges: 20,
                categories: ['Web', 'Crypto', 'Pwn'],
                featured: true,
                highlights: ['Solved all web challenges', 'First blood on Crypto Master'],
                writeups: [
                    {
                        challenge: 'Web - Admin Panel',
                        difficulty: 'Hard',
                        points: 500,
                        solution: 'Exploited JWT token vulnerability through timing attack'
                    }
                ]
            }
        ]
    };
}
function getSampleBootcampProjects() {
    return [
        {
            id: 1,
            title: 'E-Commerce Application',
            description: 'Full-stack e-commerce platform with user authentication, product catalog, and payment integration',
            role: 'Full-Stack Developer',
            teamSize: 'Solo Project',
            duration: '3 weeks',
            technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API'],
            features: [
                'User authentication and authorization',
                'Product browsing with search and filters',
                'Shopping cart functionality',
                'Secure payment processing',
                'Order history and tracking'
            ],
            challenges: 'Implementing secure payment processing and managing complex state',
            learnings: 'Gained deep understanding of authentication flows and API integration',
            githubUrl: 'https://github.com/yourusername/ecommerce-app',
            liveUrl: '',
            status: 'Completed',
            featured: true
        },
        {
            id: 2,
            title: 'Weather Dashboard',
            description: 'Interactive weather application with location-based forecasts',
            role: 'Frontend Developer',
            teamSize: 'Solo Project',
            duration: '1 week',
            technologies: ['HTML', 'CSS', 'JavaScript', 'OpenWeather API'],
            features: [
                'Current weather and 5-day forecast',
                'Location search with autocomplete',
                'Responsive design',
                'Local storage for saved locations'
            ],
            challenges: 'Handling asynchronous API calls and error handling',
            learnings: 'Improved skills in working with APIs and async/await',
            githubUrl: 'https://github.com/yourusername/weather-dashboard',
            liveUrl: 'https://yourusername.github.io/weather-dashboard',
            status: 'Completed',
            featured: false
        }
    ];
}

// ============================================
// PROJECT MODAL VIEWER
// ============================================

function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('close-modal');
    const iframe = document.getElementById('project-iframe');

    if (!modal || !closeBtn) {
        console.log('Modal elements not found');
        return;
    }

    // Close modal on button click
    closeBtn.addEventListener('click', closeProjectModal);

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });

    // Prevent body scroll when modal is open
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (modal.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });
    });

    observer.observe(modal, { attributes: true });
}

function openProjectModal(projectData) {
    const modal = document.getElementById('project-modal');
    const title = document.getElementById('modal-project-title');
    const links = document.getElementById('modal-project-links');
    const iframe = document.getElementById('project-iframe');
    const loading = document.getElementById('modal-loading');

    if (!modal || !title || !links || !iframe) {
        console.error('Modal elements not found');
        return;
    }

    // Set title
    title.textContent = projectData.title;

    // Set links
    links.innerHTML = '';
    if (projectData.githubUrl) {
        links.innerHTML += `
            <a href="${projectData.githubUrl}" target="_blank">
                <i class="fab fa-github"></i> Code
            </a>
        `;
    }
    if (projectData.liveUrl) {
        links.innerHTML += `
            <a href="${projectData.liveUrl}" target="_blank">
                <i class="fas fa-external-link-alt"></i> Live Site
            </a>
        `;
    }

    // Show modal
    modal.classList.add('active');
    loading.style.display = 'block';
    iframe.style.display = 'none';

    // Load project in iframe
    if (projectData.projectFile) {
        iframe.src = projectData.projectFile;

        iframe.onload = function() {
            loading.style.display = 'none';
            iframe.style.display = 'block';
        };

        iframe.onerror = function() {
            loading.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>
                <p>Could not load project. Try the live link instead.</p>
            `;
        };
    } else if (projectData.liveUrl) {
        // If no project file, load live URL
        iframe.src = projectData.liveUrl;

        iframe.onload = function() {
            loading.style.display = 'none';
            iframe.style.display = 'block';
        };
    } else {
        loading.innerHTML = `
            <i class="fas fa-info-circle" style="color: var(--accent-color);"></i>
            <p>Interactive demo not available. Check GitHub for code.</p>
        `;
    }
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    const iframe = document.getElementById('project-iframe');

    if (modal) {
        modal.classList.remove('active');
        // Clear iframe to stop any running code
        if (iframe) {
            iframe.src = '';
        }
    }
}