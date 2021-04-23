import React from "react";

/**
 * Notes: A key challenge for this one is dynamically loading messages as the
 * user scrolls back. After all, we don't want to load thousands of messages at
 * once, so we need some way of fetching messages when necessary. Don't worry,
 * this is all handled for you in ../helpers/list-scroller.tsx. Take a look at
 * ./channel-list-view.tsx for an example of how to use it.
 */

/**
 * - Hybrid view where messages are stacked on top of one another.
 * - Bar chart is displayed alongside messages
 * - When the user hovers over a bar, it should highlight all the bars of the
 *   same user while dimming other bars
 */
export const ChannelViewB = ({
  channelId,
  guildId,
}: {
  channelId: string;
  guildId: string;
}) => <i>WIP</i>;