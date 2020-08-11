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
import Can from '../../hoc/Can';

const initialAlertState: AlertData = {visible: false };

const Actors = (props: React.PropsWithChildren<ActorsProps> & RouteComponentProps<{id?: string|undefined}>) => {
  const [alertData, setAlertData] = useState<AlertData>(initialAlertState)
  const [allActors, setActorItems] = useState<ActorDto[]>([]);
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

  const onActorDeleteClicked = (actorToDelete: ActorDto) => {
    axiosActors.deleteActor(actorToDelete.id)
      .then(() => {
        const updatedItems = allActors.filter(actor => actor.id !== actorToDelete.id);
        setActorItems(updatedItems);
        setAlertData({
          visible: true,
          message: `Movie '${actorToDelete.name}' deleted successfully`,
          alertType: 'success'
        });
      }).catch((error) => {
        setAlertData({
          visible: true,
          alertType: 'danger',
          message: error.message
        });
      });
  };

  const handleModalClose = () => {
    setModalData({
      visible: false,
      isEditing: false
    });

  };

  const NUM_OF_CARD_PER_ROW = 3;
  const cardDesks: Array<JSX.Element[]> = [[]];
  allActors.forEach((actorItem: ActorDto) => {
    if (cardDesks[cardDesks.length - 1].length >= NUM_OF_CARD_PER_ROW) {
      cardDesks.push([]);
    }
    cardDesks[cardDesks.length - 1].push(
      <Actor
        key={actorItem.id}
        data={actorItem}
        onEdit={() => onActorEditClicked(actorItem)}
        onDelete={() => onActorDeleteClicked(actorItem)}
      >
        {actorItem.name}
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
        <Can permissions={["create:actors"]}>
          <Col md="auto">
            <Button variant="primary" size="lg" className='mb-3' onClick={onActorAddClicked}>Add Actor</Button>
          </Col>
        </Can>
        <Col>
          {alertData.visible ? <Alert key={1} variant={alertData.alertType || 'primary'}>{alertData.message}</Alert> : null }
        </Col>
      </Row>
      {
        allActors.length > 0 ?  cardDesks.map((cards, index) => {
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