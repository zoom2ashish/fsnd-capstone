import React, { useState, useEffect }  from 'react';
import Actor from '../../components/Actor/Actor';
import { ActorDto } from '../../dto';

export interface ActorsProps {
}

const Actors = (props: React.PropsWithChildren<ActorsProps>) => {
  const [actorItems, setActorItems] = useState([]);

  useEffect(() => {
      fetch('/api/actors').then(response => response.json()).then(data => {
        setActorItems(data.results);
      })
  }, []);

  const actors = actorItems.map((actorItem: ActorDto) => {
    return (<Actor key={actorItem.id} data={actorItem}></Actor>);
  });

  return (
    <>
      {actors}
    </>
  );
};

export default Actors;