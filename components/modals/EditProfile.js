import React, { useState } from 'react';
import { Modal, Input } from '@geist-ui/react';
import makeStyles from '../makeStyles';
import * as Icons from 'react-feather';
import { updateName } from '../../lib/threadDb';
import Loader from '../modals/Loader';

const useStyles = makeStyles((ui) => ({
  form: {
    display: ' flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    margin: '6px 0',
  },
  inputField: {
    width: '310px !important',
  },
}));

function EditProfie({ editProfile, setEditProfile, profileData, setProfileData }) {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    
    setLoading(true);
    const status = await updateName(profileData.name, profileData.email);
    if (status) {
      setEditProfile(false)
      setLoading(false);
    }
  };

  return (
    <>
    <Loader
        loading={loading}
        heading="Update Profile"
        content="Updating profile"
      />
    <Modal
      open={editProfile}
      onClose={() => setEditProfile(false)}
    >
      <Modal.Title>Edit Profile </Modal.Title>

      <Modal.Content>
        <div className={classes.form}>
          <div className={classes.input}>
            <Input
              initialValue={profileData.name}
              icon={<Icons.User />}
              className={classes.inputField}
              onChange={(e) => { profileData.name = e.target.value; setProfileData(profileData) } }
            />
          </div>
        </div>
      </Modal.Content>
      <Modal.Action passive onClick={() => setEditProfile(false)}>
        Cancel
      </Modal.Action>
      <Modal.Action onClick={handleSubmit}>Submit</Modal.Action>
    </Modal>
    </>
  );
}

export default EditProfie;
