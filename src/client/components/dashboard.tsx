import * as React from "react";
import { useEffect } from "react";
import {
  Link,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { join } from "../../utils";
import { api, Channel, Guild } from "../api";
import { useAwaitAll, useAwaitTo } from "../hooks/use-await";
import { useMessages } from "../hooks/use-messages";
import * as Sockets from "../sockets";
import { Layout } from "./layout";
import styles from "./dashboard.module.css";

export const Dashboard = () => {
  const { path } = useRouteMatch();
  return (
    <Layout>
      <h2>Dashboard</h2>
      <Switch>
        <Route exact path={path}>
          <GuildSelector />
        </Route>
        <Route path={`${path}/:guildId`}>
          <GuildDashboard />
        </Route>
      </Switch>
    </Layout>
  );
};

const GuildSelector = () => {
  const [err, guilds] = useAwaitTo(api("/api/guild/list"));
  const { url } = useRouteMatch();
  return (
    <>
      <h3>Your Guilds</h3>
      {err ? (
        <i>Error fetching guilds: {err.message}</i>
      ) : !guilds ? (
        <i>Loading...</i>
      ) : !guilds.length ? (
        <i>No applicable guilds found</i>
      ) : (
        guilds.map((guild) => (
          <Link to={join(url, guild.id)} key={guild.id}>
            {guild.name}
          </Link>
        ))
      )}
    </>
  );
};

const GuildDashboard = () => {
  const { guildId } = useParams<{ guildId: string }>();
  const [guildErr, guild] = useAwaitTo(api("/api/guild", { guildId }));
  const channels = useAwaitAll(
    guild?.channels.map((channelId) =>
      api("/api/channel", { guildId, channelId })
    ),
    undefined,
    [guild]
  );
  const textChannels = channels?.filter((channel) => channel.type === "text");

  useEffect(() => {
    Sockets.connect();
  }, []);

  return (
    <>
      {guildErr ? (
        <i>Error fetching guild : {guildErr.message}</i>
      ) : !guild ? (
        <i>Loading...</i>
      ) : (
        <>
          <h3>{guild.name}</h3>
          {textChannels?.map((channel) => (
            <ChannelView guild={guild} channel={channel} key={channel.id} />
          ))}
        </>
      )}
    </>
  );
};

const ChannelView = ({
  guild,
  channel,
}: {
  guild: Guild;
  channel: Channel;
}) => {
  const [err, messages] = useMessages({
    guildId: guild.id,
    channelId: channel.id,
  });

  return (
    <div className={styles.channelView}>
      <h4>{channel.name}</h4>
      {err ? (
        <i>Error loading messages: {err.message}</i>
      ) : !messages ? (
        <i>Loading...</i>
      ) : (
        messages.map((message) => (
          <div key={message.id} style={{ borderStyle: "solid" }}>
            {message.content}
          </div>
        ))
      )}
    </div>
  );
};
