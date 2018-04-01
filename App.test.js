import React from 'react';
import App from './App';
import MyGitHub from './MyGitHub';
import MyRepos from './Repos';
import RepoList from './RepoList';
import MyFollowers from './Followers';
import {FollowersList} from './FollowersList';
import MyFollowing from './Following';
import {FollowingList} from './FollowingList';

import renderer from 'react-test-renderer';


test('Login renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toMatchSnapshot();
});



test('MyGitHub renders without crashing', () => {
	const rendered = renderer.create(<MyGitHub />).toJSON();
	expect(rendered).toMatchSnapshot();
});


test('RepoList renders without crashing', () => {
	const rendered = renderer.create(<RepoList />).toJSON();
	expect(rendered).toMatchSnapshot();
});



test('FollowersList renders without crashing', () => {
	const rendered = renderer.create(<FollowersList />).toJSON();
	expect(rendered).toMatchSnapshot();
});


test('FollowingList renders without crashing', () => {
	const rendered = renderer.create(<FollowingList />).toJSON();
	expect(rendered).toMatchSnapshot();
});


