document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/lydiaandriop/repos');
        const repos = await response.json();
        const projectsContainer = document.getElementById('github-projects');

        repos.forEach(async repo => {
            const languagesResponse = await fetch(repo.languages_url);
            const languages = await languagesResponse.json();
            const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
            const languagePercentages = Object.keys(languages).map(lang => {
                return `${lang}: ${(languages[lang] / totalBytes * 100).toFixed(1)}%`;
            }).join(' ');

            const projectDiv = document.createElement('div');
            projectDiv.className = 'github-project';
            projectDiv.innerHTML = `
                <h2>${repo.name}</h2>
                <p>${repo.description || 'No description available.'}</p>
                <div class="buttons">
                    <a href="${repo.html_url}" target="_blank">Repo</a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank">Demo</a>` : ''}
                </div>
                <p class="languages">Languages: ${languagePercentages}</p>
            `;
            projectsContainer.appendChild(projectDiv);
        });
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
    }
}

fetchGitHubProjects();
