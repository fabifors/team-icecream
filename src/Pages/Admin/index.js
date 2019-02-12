import React, {Component} from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../../Pages/Session';
import * as ROLES from '../../constants/roles';

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>
        <h1>Admin</h1>
        <p>
          The Admin Page is accessible by every signed in admin user.
        </p>

        {loading && <div>Loading ...</div>}

        <UserList users={users} />
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
          <ul>
            <li>
              <strong>E-Mail:</strong> {user.email}
            </li>
            <li>
              <strong>Username:</strong> {user.username}
            </li> 
          </ul>
        </span>
      </li>
    ))}
  </ul>
);


const condition = authUser =>
  authUser && authUser.roles.includes(ROLES.Admin);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(Admin);


