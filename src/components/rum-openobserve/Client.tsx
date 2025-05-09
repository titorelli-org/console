"use client";

import { useEffect, type FC } from "react";
import { openobserveRum } from "@openobserve/browser-rum";
import { openobserveLogs } from "@openobserve/browser-logs";
import dynamic from "next/dynamic";

const options = {
  clientToken: "rumVH7tvydkS98EJzzk",
  applicationId: "console",
  site: "openobserve.next.titorelli.ru",
  service: "console",
  env: process.env.NODE_ENV,
  version: "0.1.0",
  organizationIdentifier: "default",
  insecureHTTP: false,
  apiVersion: "v1",
};

const Client$: FC<{ userId?: number; userUsername?: string }> = ({
  userId,
  userUsername,
}) => {
  useEffect(() => {
    if (openobserveRum.getInternalContext() == null) {
      openobserveRum.init({
        applicationId: options.applicationId, // required, any string identifying your application
        clientToken: options.clientToken,
        site: options.site,
        organizationIdentifier: options.organizationIdentifier,
        service: options.service,
        env: options.env,
        version: options.version,
        trackResources: true,
        trackLongTasks: true,
        trackUserInteractions: true,
        apiVersion: options.apiVersion,
        insecureHTTP: options.insecureHTTP,
        defaultPrivacyLevel: "allow", // 'allow' or 'mask-user-input' or 'mask'. Use one of the 3 values.
      });
    }

    if (openobserveLogs.getInternalContext() == null) {
      openobserveLogs.init({
        clientToken: options.clientToken,
        site: options.site,
        organizationIdentifier: options.organizationIdentifier,
        service: options.service,
        env: options.env,
        version: options.version,
        forwardErrorsToLogs: true,
        insecureHTTP: options.insecureHTTP,
        apiVersion: options.apiVersion,
      });
    }

    if (userId) {
      openobserveRum.setUser({
        id: String(userId),
        username: userUsername,
      });
    }

    openobserveRum.startSessionReplayRecording();
  }, [userId, userUsername]);

  return null;
};

export const Client = dynamic(() => Promise.resolve(Client$), { ssr: false });
