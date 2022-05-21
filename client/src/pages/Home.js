import React from 'react'; 
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';
import Auth from '../utils/auth';

const Home = () => {
  // use useQuery hook to make a query request
  // loading literally is returned to indicate the requests not done yet
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // destructure data out and rename it userData
  const { data: userData } = useQuery(QUERY_ME_BASIC)

  // called 'OPTIONAL CHAINING', currently only supported in the browser
  // negates the need to check if an object exists before accessing its properties
  // literally reads = if data exists, store it in the thoughts constant, if not, store an empty array
  const thoughts = data?.thoughts || [];

  // create logged in variable which will be true when loggedIn
  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className='flex-row justify-space-between'>
        {loggedIn && (
          <div className='col-12 mb-3'>
            <ThoughtForm />
          </div>
        )}
                      {/* conditionally change grid spacing */}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Food for Thought(s)..." />
          )}
        </div>
        {loggedIn && userData ? (
          <div className='col-12 col-lg-3 mb-3'>
            <FriendList 
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
