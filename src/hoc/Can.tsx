import React, { useEffect, useState } from 'react';
import { withAuth0, WithAuth0Props } from '@auth0/auth0-react';
import {decode as jwtDecode } from 'jsonwebtoken';
import isString from 'lodash/isString';

export interface CanProps {
  permissions: string[],
  action?: 'hide' | 'disable'
}

const Can = (props: React.PropsWithChildren<WithAuth0Props & CanProps>) => {
  const { isAuthenticated, getAccessTokenSilently } = props.auth0;
  const [ canPerform, setCanPerform ] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      const payload = jwtDecode(token, { json: true });
      if (!payload || !Array.isArray(payload.permissions)) {
        setCanPerform(false);
      }

      const userPermissions: string[] = (payload ? payload.permissions : []) || [];
      const permissionsToCheck = props.permissions || [];
      const hasPermission = permissionsToCheck.every(permissionToCheck => {
        return userPermissions.indexOf(permissionToCheck) > -1;
      });

      setCanPerform(hasPermission);

    })();
  }, [isAuthenticated, getAccessTokenSilently, props.permissions])

  return (
    <>
      { canPerform ? props.children : null }
    </>
  );
};

export default withAuth0(Can);