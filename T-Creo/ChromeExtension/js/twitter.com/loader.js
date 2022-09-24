import { AbstractTCreoLoader } from "../t-creo-core.js";

export default class TCreoTwitterLoader extends AbstractTCreoLoader {
    /**
     * Gets score input data from the provided listener input
     * @param {string} dataString Data from xhr request
     * @returns {[string[], object[]]} Ids and data rows
     */
    map(dataString) {
        const data = JSON.parse(dataString);
        const entries = data.data.home.home_timeline_urt.instructions[0].entries;
        const items = entries
            // filter only tweets
            .filter(e => e.content.entryType === "TimelineTimelineItem")
            // flatten items
            .reduce((a, b) => a.concat(b.content.items ?? b.content), []);


        console.debug("Mapping...");
        console.debug(dataString);
        console.debug("data: ", data);
        console.debug("found entries: ", entries);
        console.debug("found items: ", items);

        // Map the selected fields
        const ids = [];
        const rows = [];
        for (let i = 0; i < items.length; i++) {
            var result = items[i].itemContent.tweet_results.result;
            // Select retweet source if available
            if (result.legacy.retweeted_status_result)
                result = result.legacy.retweeted_status_result.result;

            const tweet = result.legacy;
            const user = result.core.user_results.result.legacy;
            const dateCreated = new Date(user.created_at);

            ids.push(tweet.id_str);
            rows.push({
                text: tweet.full_text,
                likes: tweet.favorite_count,
                retweets: tweet.retweet_count,
                quotes: tweet.quote_count,
                replies: tweet.reply_count,
                user_followers: user.followers_count,
                user_following: user.friends_count,
                user_active_time: new Date() - dateCreated
            });
        }

        return [ids, rows];
    }
}