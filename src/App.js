import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { contributors: [] }
  }

  componentDidMount() {
    const organisation = '<INSERT ORG NAME HERE>';
    const headers = new Headers();
    headers.append('Authorization', 'token <INSERT OAUTH TOKEN HERE>')

    const contributors = {};
    const addContributions = (user, contributions) => {
      contributors[user] = (contributors[user] || 0) + contributions;
    };
    fetch(`https://api.github.com/orgs/${organisation}`, { headers })
      .then(res => res.json())
      .then(org => fetch(org.repos_url, { headers }))
      .then(res => res.json())
      .then(repos => Promise.all(repos.map(repo => fetch(repo.contributors_url, { headers }))))
      .then(resArr => Promise.all(resArr.map(res => res.json())))
      .then(repoContributors => {
        repoContributors.forEach(repo => {
          repo.forEach(contributor => {
            addContributions(contributor.login, contributor.contributions);
          });
        });
        const contributorArray = Object.keys(contributors).map(name => ({ name, contributions: contributors[name] }));
        const sortedContributors = contributorArray.sort((left, right) => right.contributions - left.contributions);

        this.setState({ contributors: sortedContributors });
      });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <table style={{ margin: '0 auto' }}>
          <thead><tr><th>User</th><th>Contributions</th></tr></thead>
          <tbody>
            {this.state.contributors.map(contributor => (
              <tr key={contributor.name}>
                <td>{contributor.name}</td>
                <td>{contributor.contributions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
