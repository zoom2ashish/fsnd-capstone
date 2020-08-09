import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import CardDeck from 'react-bootstrap/CardDeck';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Actor from '../../components/Actor/Actor';
import { ActorDto, ActorsProps, ModalData, AlertData } from '../../dto';
import ActorForm from '../../components/ActorForm/ActorForm';
import * as axiosActors from '../../services/axios-actors';

const initialAlertState: AlertData = {visible: false };

const Actors = (props: React.PropsWithChildren<ActorsProps> & RouteComponentProps<{id?: string|undefined}>) => {
  const [alertData, setAlertData] = useState<AlertData>(initialAlertState)
  const [movieItems, setActorItems] = useState<ActorDto[]>([]);
  const [modalData, setModalData] = useState<ModalData<ActorDto>>({
    visible: false,
    isEditing: false
  });

  useEffect(() => {
      axiosActors.fetchActors().then(data => {
        setActorItems(data.results);
      })
  }, [modalData.visible]);

  const onActorAddClicked = () => {
    setModalData({
      ...modalData,
      visible: true,
      isEditing: false
    });
  };

  const onActorEditClicked = (actor: ActorDto) => setModalData({
    ...modalData,
    visible: true,
    isEditing: true,
    data: actor
  });

  const onActorEditDeleted = (id: number) => {
    console.log('Actor Id Deleted', id);
  };

  const handleModalClose = () => {
    setModalData({
      visible: false,
      isEditing: false
    });

  };

  const NUM_OF_CARD_PER_ROW = 3;
  const cardDesks: Array<JSX.Element[]> = [[]];
  movieItems.forEach((movieItem: ActorDto) => {
    if (cardDesks[cardDesks.length - 1].length >= NUM_OF_CARD_PER_ROW) {
      cardDesks.push([]);
    }
    cardDesks[cardDesks.length - 1].push(
      <Actor
        key={movieItem.id}
        data={movieItem}
        onEdit={() => onActorEditClicked(movieItem)}
        onDelete={() => onActorEditDeleted(movieItem.id)}
      >
        {movieItem.name}
      </Actor>
    );
  });

  const noActorsPlaceHolder = (
    <Col> No Actors Found </Col>
  );

  const modal = modalData.visible ? (
    <ActorForm show={modalData.visible} isEditing={modalData.isEditing} onClose={handleModalClose} data={modalData.data}></ActorForm>
  ) : null;

  return (
    <>
      <Row>
        <Col md="auto">
          <Button variant="primary" size="lg" className='mb-3' onClick={onActorAddClicked}>Add Actor</Button>
        </Col>
        <Col>
          {alertData.visible ? <Alert key={1} variant={alertData.alertType || 'primary'}>{alertData.message}</Alert> : null }
        </Col>
      </Row>
      {
        movieItems.length > 0 ?  cardDesks.map((cards, index) => {
          return (
            <CardDeck key={index} className="mt-3">
              {cards}
            </CardDeck>
          );
        }) : noActorsPlaceHolder
      }
      {modal}
    </>
  );
};

export default withRouter(Actors);