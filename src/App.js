import React from 'react';
import {  Switch, Route, NavLink } from "react-router-dom";
import { useTransition, animated } from 'react-spring';
import useRouter from './useRouter';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Logs from './pages/Logs';

function App() {
  const { location } = useRouter();
  const transitions = useTransition(location, location => location.pathname, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
        duration: 300
    },
  });

  return (
      <>
        <Navigation>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/logs">Log</NavLink>
        </Navigation>
        {transitions.map(({ item, props, key }) => (
            <animated.div className="wrapper" key={key} style={props}>
              <Switch location={item}>
                <Route path="/" component={Home} exact />
                <Route path="/logs" component={Logs} />
              </Switch>
            </animated.div>
        ))}
      </>
  )
}

export default App;
