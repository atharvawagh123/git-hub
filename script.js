const repoContainer = document.getElementById('repoContainer');
const pagination = document.getElementById('pagination');
let currentPage = 1;
let repositoriesPerPage = 5; // Change this as needed

document.getElementById('fetchButton').addEventListener('click', fetchRepositories);
document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);

function fetchRepositories() {
    const username = document.getElementById('username').value;
    const language = document.getElementById('languageFilter').value;

    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(data => {
            if (language) {
                data = data.filter(repo => repo.language === language);
            }
            displayRepositories(data);
        })
        .catch(error => console.error('Error fetching repositories:', error));
}

function displayRepositories(repositories) {
    repoContainer.innerHTML = ''; // Clear previous results
    const paginatedRepos = paginate(repositories, currentPage, repositoriesPerPage);
    paginatedRepos.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.className = 'repo';
        repoElement.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || 'No description available.'}</p>
            <p><strong>Language:</strong> ${repo.language || 'N/A'}</p>
            <p><strong>Stars:</strong> ${repo.stargazers_count}</p>
            <p><strong>Forks:</strong> ${repo.forks_count}</p>
            <p><strong>License:</strong> ${repo.license ? repo.license.name : 'N/A'}</p>
            <button onclick="copyCloneUrl('${repo.clone_url}')">Copy Clone URL</button>
        `;
        repoContainer.appendChild(repoElement);
    });
    setupPagination(repositories.length);
}

function paginate(items, page, itemsPerPage) {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
}

function setupPagination(totalItems) {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalItems / repositoriesPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', () => {
            currentPage = i;
            fetchRepositories();
        });
        pagination.appendChild(button);
    }
}

function copyCloneUrl(url) {
    navigator.clipboard.writeText(url)
        .then(() => alert('Clone URL copied to clipboard!'))
        .catch(err => console.error('Could not copy text: ', err));
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

