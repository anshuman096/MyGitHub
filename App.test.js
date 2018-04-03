import React from 'react';
import App from './App';
import MyGitHub from './screens/MyGitHub';
import RepoList from './screens/RepoList';
import {FollowersList} from './screens/FollowersList';
import {FollowingList} from './screens/FollowingList';
import NotificationsList from './screens/NotificationsList';
import CoolRepoDetails from './screens/CoolRepoDetails';

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

test('NotificationsList renders without crashing', () => {
	const rendered = renderer.create(<NotificationsList/>).toJSON();
	expect(rendered).toMatchSnapshot();
});

test('CoolRepoDetails renders without crashing', () => {
	const rendered = renderer.create(<CoolRepoDetails/>).toJSON();
	expect(rendered).toMatchSnapshot();
});


