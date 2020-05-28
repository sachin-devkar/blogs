import { uniqBy } from "lodash";
import * as RECOMMENDED_PARTICIPANTS from "../constants/recommended-participants";
import { withCache } from "../utils/cache";
import {
  ALL_VENDOR_RECOMMENDED_PARTICIPANTS_DEBOUNCE,
  ALL_VENDOR_RECOMMENDED_PARTICIPANTS_KEY,
  ALL_VENDOR_RECOMMENDED_PARTICIPANTS_TTL,
} from "../constants/cache";

/* eslint-disable no-unused-vars */
const resolvers = {
  async analyticsFeeds(_source, _args, { dataSources }) {
    return dataSources.owsAnalytics.getAnalyticsFeeds();
  },
  async allProductsSearch(
    _source,
    {
      status = null,
      term = null,
      subaccounts = null,
      startDate = "",
      endDate = "",
      sortField = "release_date",
      sortDir = "desc",
      productConfiguration = null,
      displayStatus = null,
      productType = null,
      limit = 10,
      offset = 0,
    },
    { identity, dataSources }
  ) {
    return dataSources.owsSearch.searchProducts({
      status,
      sortField,
      sortDir,
      startDate,
      endDate,
      limit,
      offset,
      term,
      productType,
      subaccounts,
      productConfiguration,
      displayStatus,
    });
  },

  async artistsSearch(_source, { term, limit, offset }, { dataSources }) {
    return dataSources.owsSearch.searchArtists({ term, limit, offset });
  },

  async collaborators(
    _source,
    { limit, offset, hasRecipient },
    { dataSources }
  ) {
    return dataSources.owsCollaborator.getCollaborators({
      limit: limit || 0,
      offset: offset || 0,
      hasRecipient,
    });
  },

  async transferWiseAccountRequirements(
    _source,
    { source, target },
    { dataSources }
  ) {
    return dataSources.owsCollaborator.getTransferWiseAccountRequirements({
      source,
      target,
    });
  },

  async transferWiseAuthorizationUrl(_source, _args, { dataSources }) {
    return dataSources.owsCollaborator.getTransferWiseAuthorizationUrl();
  },

  async transferWiseProfile(_source, _args, { dataSources }) {
    return dataSources.owsCollaborator.getTransferWiseProfile();
  },

  async soundRecordingsSearch(
    _source,
    { term, limit, offset, trackType },
    { dataSources, identity }
  ) {
    return dataSources.owsSearch.searchSoundRecordings({
      term,
      limit,
      offset,
      trackType,
    });
  },

  async deliveryLinks(_source, args, { dataSources }) {
    return dataSources.owsStoreAvailability.getDeliveryLinks(args.productId);
  },

  async search(_source, { term, limit, offset }) {
    return { term, limit, offset };
  },
  async account() {
    return {};
  },

  async product(_source, { productId, cached = true }, { dataSources }) {
    if (cached) {
      const metadata = await dataSources.owsAnalytics.getProductMetadata(
        productId
      );
      return { productId, ...metadata };
    }

    const productDocument = await dataSources.owsProduct.getProductDocument(
      productId
    );
    return { productId, ...productDocument };
  },

  async projectByProjectCode(
    _source,
    { projectCode, accountId, subaccountId },
    { dataSources }
  ) {
    return dataSources.owsProjectManager.getProjectByProjectCode(
      projectCode,
      accountId,
      subaccountId
    );
  },

  async recentPlacements(
    _source,
    { limit = 25, offset = 0, storeIds = [], ownerCategories, minFollowers },
    { dataSources }
  ) {
    return dataSources.owsAnalytics.getRecentPlacements({
      limit,
      offset,
      storeIds,
      ownerCategories: ownerCategories || [],
      minFollowers,
    });
  },

  async soundRecording(_source, { isrc, cached = true }, { dataSources }) {
    if (cached) {
      const metadata = await dataSources.owsAnalytics.getSoundRecordingMetadata(
        isrc
      );
      return { isrc, ...metadata };
    }
    throw new Error("Non-cached track queries have not been implemented!");
  },

  async collaboratorSearch(
    _source,
    { searchTerm, hasRecipient = false },
    { dataSources }
  ) {
    return dataSources.owsCollaborator.searchCollaborators(
      searchTerm,
      hasRecipient
    );
  },

  async collaborator(_source, { collaboratorId }, { dataSources }) {
    return dataSources.owsCollaborator.getCollaborator(collaboratorId);
  },

  async topSoundRecordings(
    _source,
    { metadataSource = "owsAnalytics" },
    { dataSources: { owsAnalytics } }
  ) {
    const recordings = await owsAnalytics.getTopSoundRecordings();
    return recordings.map((recording) => ({ ...recording, metadataSource }));
  },

  async accountingPeriods(_source, other, { dataSources }) {
    return dataSources.owsAccounting.getAccountingPeriods();
  },

  async searchPodcastItems(_source, { text }, { dataSources }) {
    return dataSources.owsPodcast.searchPodcastItems({ text });
  },

  async podcasts(_source, { limit, offset }, { dataSources }) {
    return dataSources.owsPodcast.getPodcasts({
      limit: limit || 0,
      offset: offset || 0,
    });
  },

  async podcast(_source, { podcastId }, { dataSources }) {
    return dataSources.owsPodcast.getPodcast(podcastId);
  },

  async episodes(
    _source,
    { podcastId, limit, offset, filterByState, orderBy, sortOrder },
    { dataSources }
  ) {
    return dataSources.owsPodcast.getEpisodes({
      id: podcastId,
      limit,
      offset,
      filterByState,
      orderBy,
      sortOrder,
    });
  },

  async episode(_source, { episodeId }, { dataSources }) {
    return dataSources.owsPodcast.getEpisode({ episodeId });
  },

  async podcastNetworks(_source, _args, { dataSources }) {
    return dataSources.owsPodcast.getNetworks();
  },

  async podcastNetwork(_source, { networkId }, { dataSources }) {
    return dataSources.owsPodcast.getNetwork(networkId);
  },

  async podcastCategories(_source, _args, { dataSources }) {
    return dataSources.owsPodcast.getPodcastCategories();
  },

  async assetTranscoderUploadToken(_source, _arg, { dataSources }) {
    return dataSources.owsAssetTranscoder.getUploadToken();
  },

  async podcastUploadToken(_source, _arg, { dataSources }) {
    return dataSources.owsPodcast.getPodcastUploadToken();
  },

  async assetTranscoderUploadStatus(_source, { filename }, { dataSources }) {
    return dataSources.owsAssetTranscoder.getUploadStatus(filename);
  },

  async adReads(_source, _args, { dataSources }) {
    return dataSources.owsPodcast.getAdReads();
  },

  async podcastUsers(_source, { limit, offset }, { dataSources }) {
    return dataSources.owsPodcast.getPodcastUsers({
      limit: limit || 0,
      offset: offset || 0,
    });
  },

  async currentPodcastUser(_source, _args, { dataSources }) {
    return dataSources.owsPodcast.getCurrentPodcastUser();
  },

  async podcastTopEpisodes(_source, body, { dataSources }) {
    return dataSources.owsPodcast.getTopEpisodes(body);
  },

  async getEpisodeDailyDownloads(_source, body, { dataSources }) {
    return dataSources.owsPodcast.getEpisodeDailyDownloads(body);
  },

  async podcastTopPodcasts(_source, body, { dataSources }) {
    return dataSources.owsPodcast.getTopPodcasts(body);
  },

  async getPodcastDailyDownloads(_source, body, { dataSources }) {
    return dataSources.owsPodcast.getPodcastDailyDownloads(body);
  },

  async podcastTopNetworks(_source, body, { dataSources }) {
    return dataSources.owsPodcast.getTopNetworks(body);
  },

  async getNetworkDailyDownloads(_source, body, { dataSources }) {
    return dataSources.owsPodcast.getNetworkDailyDownloads(body);
  },

  async podcastCountries(_source, _args, { dataSources }) {
    return dataSources.owsAnalytics.podcastCountries();
  },

  async podcastPlayers(_source, _args, { dataSources }) {
    return dataSources.owsAnalytics.podcastPlayers();
  },

  async podcastTopCountries(_source, args, { dataSources }) {
    if (dataSources.owsPodcast.checkOwnership(args.objectId, args.objectType))
      return dataSources.owsAnalytics.podcastTopCountries(args);
  },

  async podcastTopPlayers(_source, args, { dataSources }) {
    if (
      await dataSources.owsPodcast.checkOwnership(
        args.objectId,
        args.objectType
      )
    )
      return dataSources.owsAnalytics.podcastTopPlayers(args);
  },

  async artist(_source, { artistId }, { dataSources }) {
    return dataSources.owsArtist.getArtist(artistId);
  },

  async filterArtists(
    _source,
    { artistId, artistName, vendorId },
    { dataSources }
  ) {
    return dataSources.owsArtist.filterArtists({
      artistId,
      artistName,
      vendorId,
    });
  },

  async collaboratorReports(_source, params, { dataSources }) {
    const {
      reportType,
      isSummaryReport,
      limit,
      offset,
      orderBy,
      sortOrder,
    } = params;

    return dataSources.owsCollaborator.getReports({
      reportType,
      isSummaryReport,
      limit,
      offset,
      orderBy,
      sortOrder,
    });
  },

  async collaboratorReportDownload(
    _source,
    { collaboratorParams },
    { dataSources }
  ) {
    return dataSources.owsCollaborator.getReportDownload(collaboratorParams);
  },

  async participant(_source, { id, global = false }, { dataSources }) {
    if (global) {
      const [
        result,
        ...rest
      ] = await dataSources.graphqlKnowledge.globalParticipantById({ id });
      return result;
    }

    return dataSources.owsParticipant.participantGet(id);
  },

  async participantSearch(
    _source,
    { name, vendorId, subaccountId, limit, offset },
    { dataSources }
  ) {
    return dataSources.owsParticipant.participantSearch(
      name,
      vendorId,
      subaccountId || 0,
      limit || 0,
      offset || 0
    );
  },

  async networkParticipantSearch(
    _source,
    { name, networkId },
    { dataSources }
  ) {
    return dataSources.owsParticipant.networkParticipantSearch(name, networkId);
  },

  async labelParticipantSearch(
    _source,
    { name, vendorId, subaccountId, role, limit, offset },
    { dataSources }
  ) {
    return dataSources.owsParticipant.labelParticipantSearch(
      name,
      vendorId,
      subaccountId || 0,
      role,
      limit || 0,
      offset || 0
    );
  },

  async participantServiceSearch(
    _source,
    { service, query, limit, offset },
    { dataSources }
  ) {
    return dataSources.owsParticipant.participantServiceSearch(
      service,
      query,
      limit || 10,
      offset || 0
    );
  },

  async participantServiceArtist(
    _source,
    { service, identifier },
    { dataSources }
  ) {
    return dataSources.owsParticipant.participantServiceArtist(
      service,
      identifier
    );
  },

  async participationRoleCategories(_source, args, context, info) {
    return context.dataSources.graphqlParticipant.participationRoleCategories(
      context,
      info
    );
  },

  async vendorCurrency(_source, args, { dataSources }) {
    return dataSources.owsAccounting.getVendorCurrency();
  },

  async getAvailableVideoChannelsByProductId(
    _source,
    { productId },
    { dataSources }
  ) {
    return dataSources.owsVideo.getProductAvailableChannels(productId);
  },

  async getAvailableVideoChannelsByProjectId(
    _source,
    { projectId, accountId, subaccountId },
    { dataSources }
  ) {
    return dataSources.owsVideo.getProjectAvailableChannels(
      projectId,
      accountId,
      subaccountId
    );
  },
  async starredItems() {
    return {};
  },
  async getVendorAgreement(
    _source,
    { optInPreferenceId, excludeImpersonator },
    { dataSources }
  ) {
    return dataSources.owsUsers.getVendorAgreement(
      optInPreferenceId,
      excludeImpersonator
    );
  },

  async featureFlag(_source, { name }, { dataSources, identity }) {
    return dataSources.owsFeatures.hasSplitFeature({
      identity,
      name,
    });
  },
  async globalParticipantById(
    _source,
    { id, chartmetricId, spotifyId, appleMusicId },
    { dataSources }
  ) {
    if (id) return dataSources.graphqlKnowledge.globalParticipantById({ id });

    if (chartmetricId)
      return dataSources.graphqlKnowledge.globalParticipantByChartmetricId({
        chartmetricId,
      });

    if (spotifyId)
      return dataSources.graphqlKnowledge.globalParticipantBySpotifyId({
        spotifyId,
      });

    if (appleMusicId)
      return dataSources.graphqlKnowledge.globalParticipantByAppleMusicId({
        appleMusicId,
      });
  },

  async globalParticipantSearchByName(
    _source,
    { term, first, offset },
    { dataSources }
  ) {
    return dataSources.graphqlKnowledge.globalParticipantSearchByName({
      term,
      first,
      offset,
    });
  },

  async globalParticipantByProfile(
    _source,
    { skip, limit },
    { dataSources, profileId, profileType, identity }
  ) {
    return dataSources.graphqlParticipant.globalParticipantByProfile({
      skip,
      limit,
      profileId,
      profileType,
      identity,
    });
  },

  async applications(_source, _args, { dataSources }) {
    return dataSources.owsUsers.getApplications();
  },
  async track(_source, { tuid }, { dataSources }) {
    const track = await dataSources.owsTrack.getTrack(tuid);
    return track;
  },
  async transferWiseValidateField(_source, { url, params }, { dataSources }) {
    return dataSources.owsCollaborator.validateTransferWiseField({
      url,
      params,
    });
  },
  async recommendedParticipants(
    _source,
    _args,
    { dataSources, profileId, profileType, identity }
  ) {
    const hasAllVendors = await dataSources.owsPermissions.hasAllVendors({
      profileId,
      profileType,
    });

    const getParticipants = async () => {
      const [
        globalRecommendedParticipants,
        recommendedParticipants,
      ] = await Promise.all([
        dataSources.graphqlParticipant.globalParticipantByProfile({
          profileId,
          profileType,
          identity,
        }),
        dataSources.graphqlKnowledge.getParticipantsByIds(
          Object.values(RECOMMENDED_PARTICIPANTS)
        ),
      ]);

      const recommendedParticipantsFlat = recommendedParticipants.flat();

      const minLength = Math.min(
        recommendedParticipantsFlat.length,
        globalRecommendedParticipants.length
      );

      const output = Array.from(
        { length: minLength * 2 },
        (_, i) =>
          (i % 2 ? recommendedParticipantsFlat : globalRecommendedParticipants)[
            Math.floor(i / 2)
          ]
      ).concat(
        recommendedParticipantsFlat.slice(minLength),
        globalRecommendedParticipants.slice(minLength)
      );

      return uniqBy(output, "id");
    };

    if (hasAllVendors)
      return withCache(
        {
          key: ALL_VENDOR_RECOMMENDED_PARTICIPANTS_KEY,
          ttl: ALL_VENDOR_RECOMMENDED_PARTICIPANTS_TTL,
          update: true,
          debounce: ALL_VENDOR_RECOMMENDED_PARTICIPANTS_DEBOUNCE,
        },
        getParticipants
      );

    return getParticipants();
  },
  // async ProductDistributionSearch(_source, productId, { dataSources }) {
  //   const productDocument = await dataSources.owsDistribution.getProductDistribution(
  //     productId
  //   );
  //   return { productId, ...productDocument };
  // },

  async ProductDistributionSearch(_source, _arg, { dataSources }) {
    return await dataSources.owsDistribution.getProductDistribution(
      _arg.productId
    );
  },
};

export default resolvers;
