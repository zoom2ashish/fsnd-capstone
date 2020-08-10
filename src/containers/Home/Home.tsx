import React from 'react';
import homeImage from '../../assets/images/home.jpg';
import Image from 'react-bootstrap/Image';
import classes from './Home.module.css';

const Home = (props: React.PropsWithChildren<any>) => {
  return (
    <div className={classes.HomeImageContainer}>
      <Image className={classes.HomeImage} src={homeImage} rounded />
    </div>
  );
};

export default Home;