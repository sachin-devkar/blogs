/* eslint-disable no-unused-vars */
import PRODUCT_CONFIGURATION from "./enums/product-configuration";
import { HAS_FOLLOWED } from "./enums/follow-global-participant-relationship";

const resolvers = {
  async createCollaborator(_source, { input }, { dataSources }) {
    return dataSources.owsCollaborator.createCollaborator(
      input.name,
      input.email,
      input.subaccountId,
      input.participantId
    );
  },

  async updateCollaborator(_source, { input }, { dataSources }) {
    return dataSources.owsCollaborator.updateCollaborator(input);
  },

  async createProject(_source, { input }, { dataSources }) {
    return dataSources.owsProjectManager.createProject(input);
  },

  async saveCollaboratorSplits(_source, { input }, { dataSources }) {
    const results = {
      created: [],
      updated: [],
      deleted: [],
    };

    // We validate whether the total split value for a recording is more than 100% when
    // modifying splits, so we need to save changes in this order: delete, update, created

    if (input.delete && input.delete.length !== 0) {
      const ids = input.delete.map((item) => item.id);
      results.deleted = await dataSources.owsCollaborator.deleteSplits(ids);
    }

    if (input.update && input.update.length !== 0)
      results.updated = await dataSources.owsCollaborator.updateSplits(
        input.update
      );

    if (input.create && input.create.length !== 0)
      results.created = await dataSources.owsCollaborator.createSplits(
        input.create
      );

    return results;
  },

  async triggerCollaboratorsReportGeneration(
    _source,
    {
      input: {
        firstPeriodId,
        lastPeriodId,
        periodName,
        clientEmail,
        reportRunName,
        collaboratorIds,
      },
    },
    { dataSources }
  ) {
    await dataSources.owsCollaborator.triggerReportGeneration(
      firstPeriodId,
      lastPeriodId,
      periodName,
      clientEmail,
      reportRunName,
      collaboratorIds
    );

    return {
      accepted: true,
    };
  },

  async deleteCollaboratorReport(
    _source,
    { input: { collaboratorParams } },
    { dataSources }
  ) {
    await dataSources.owsCollaborator.deleteReport(collaboratorParams);

    return {
      deleted: true,
      collaboratorParams,
    };
  },

  async createTransferWiseRecipient(_source, { input }, { dataSources }) {
    return dataSources.owsCollaborator.createTransferWiseRecipient(input);
  },

  async refreshTransferWiseRecipientRequirements(
    _source,
    { input },
    { dataSources }
  ) {
    return dataSources.owsCollaborator.refreshTransferWiseRecipientRequirements(
      input
    );
  },

  async createTransferWiseProfile(_source, { input }, { dataSources }) {
    return dataSources.owsCollaborator.createTransferWiseProfile(input);
  },

  async updateProject(_source, { input }, { dataSources }) {
    return dataSources.owsProjectManager.updateProject(input, input.projectId);
  },

  async saveArtists(_source, { input }, { dataSources }) {
    let results = [];

    if (input.create)
      results = results.concat(
        await dataSources.owsArtist.createArtists(input.create)
      );
    return results;
  },

  async createProduct(_source, { input }, { dataSources }) {
    switch (input.productConfiguration) {
      case PRODUCT_CONFIGURATION.OTHER:
      case PRODUCT_CONFIGURATION.MUSIC_VIDEO: {
        const createResponse = await dataSources.owsProductDigital.createProduct(
          input
        );
        const metadataUpdateResponse = await dataSources.owsVideo.updateVideoMetadata(
          createResponse.productId,
          input
        );
        return { ...createResponse, ...metadataUpdateResponse };
      }
      default: {
        return dataSources.owsProductDigital.createProduct(input);
      }
    }
  },

  async saveVideoSingleProduct(_source, { input }, { dataSources }) {
    if (input.create) {
      const createVideoProductResponse = await dataSources.owsVideo.createVideoProduct(
        input.create
      );
      return dataSources.owsVideo.updateVideoMetadata(
        createVideoProductResponse.release_id,
        input.create
      );
    }
    if (input.update)
      return dataSources.owsVideo.updateVideoMetadata(
        input.update.productId,
        input.update,
        ["product_code", "upc", "isrc"]
      );
  },

  async updateProduct(_source, { input }, { dataSources }) {
    switch (input.productConfiguration) {
      case PRODUCT_CONFIGURATION.OTHER:
      case PRODUCT_CONFIGURATION.MUSIC_VIDEO: {
        const updateResponse = await dataSources.owsProductDigital.updateProduct(
          input.productId,
          input
        );
        const metadataUpdateResponse = await dataSources.owsVideo.updateVideoMetadata(
          updateResponse.productId,
          input
        );
        return { ...updateResponse, ...metadataUpdateResponse };
      }
      default: {
        return dataSources.owsProductDigital.updateProduct(
          input.productId,
          input
        );
      }
    }
  },

  async submitProduct(_source, { input }, { dataSources }) {
    return dataSources.owsProductDigital.submitProduct(input);
  },

  async unsubmitProduct(_source, { input }, { dataSources }) {
    return dataSources.owsProductDigital.unsubmitProduct(input.productId);
  },

  async createProductCorrection(_source, { input }, { dataSources }) {
    return dataSources.owsProductDigital.createProductCorrection(
      input.productId
    );
  },

  async deleteProductCorrection(_source, { input }, { dataSources }) {
    return dataSources.owsProductDigital.deleteProductCorrection(
      input.productId,
      input.releaseCorrectionId
    );
  },

  async createProductCorrectionDetail(_source, { input }, { dataSources }) {
    return dataSources.owsProductDigital.createProductCorrectionDetails(input);
  },

  async saveTracks(_source, { input }, { dataSources }) {
    let results = [];

    if (input.create && input.create.tracks.length > 0)
      results = results.concat(
        await dataSources.owsTrack.createTracks(input.create)
      );

    if (input.updatePosition && input.updatePosition.tracks.length > 0)
      results = await dataSources.owsTrack.updateTracksArrangement(
        input.updatePosition
      );

    if (input.delete && input.delete.tracks.length > 0)
      results = await dataSources.owsTrack.deleteTracks(input.delete);

    if (input.update && input.update.tracks.length > 0)
      results = results.concat(
        await dataSources.owsTrack.updateTracksBody(input.update)
      );

    return results;
  },

  async createPodcast(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.createPodcast(input);
  },

  async updatePodcast(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.updatePodcast(input);
  },

  async createEpisode(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.createEpisode(input);
  },

  async updateEpisode(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.updateEpisode(input);
  },

  async deletePodcast(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.deletePodcast(input);
  },

  async deleteEpisode(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.deleteEpisode(input);
  },

  async createEpisodeInsertionPoints(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.createEpisodeInsertionPoints(input);
  },

  async createInventory(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.createInventory(input);
  },

  async createAdRead(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.createAdRead(input);
  },

  async updateAdRead(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.updateAdRead(input);
  },

  async deleteAdRead(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.deleteAdRead(input);
  },

  async deletePodcastUser(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.deletePodcastUser(input);
  },

  async createPodcastUser(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.createPodcastUser(input);
  },

  async updatePodcastUser(_source, { input }, { dataSources }) {
    return dataSources.owsPodcast.updatePodcastUser(input);
  },

  async participantCreate(_source, { input }, { dataSources }) {
    return dataSources.owsParticipant.participantCreate(input);
  },

  async participantUpdate(_source, { input }, { dataSources }) {
    return dataSources.owsParticipant.participantUpdate(input);
  },

  async participantDelete(_source, { input }, { dataSources }) {
    return dataSources.owsParticipant.participantDelete(input);
  },

  async participantIncorrectProfile(_source, { input }, { dataSources }) {
    return dataSources.owsParticipant.participantIncorrectProfile(input);
  },

  async networkParticipantCreate(_source, { input }, { dataSources }) {
    return dataSources.owsParticipant.networkParticipantCreate(input);
  },

  async labelParticipantIncorrectProfile(_source, { input }, { dataSources }) {
    return dataSources.owsParticipant.labelParticipantIncorrectProfile(input);
  },

  async labelParticipantCreate(_source, { input }, { dataSources }) {
    return dataSources.owsParticipant.labelParticipantCreate(input);
  },

  async labelParticipantUpdate(_source, { input }, { dataSources }) {
    return dataSources.owsParticipant.labelParticipantUpdate(input);
  },

  async registerUserDevice(_source, { input }, { dataSources }) {
    return dataSources.owsUsers.addDevice(input);
  },

  async updateUserLocalization(_source, { input }, { dataSources }) {
    return dataSources.owsUsers.updateLocalization(input);
  },

  async logoutMobileDevice(_source, { input }, { dataSources }) {
    return dataSources.owsUsers.logoutMobileDevice(input);
  },

  async unregisterUserDevice(_source, { input }, { dataSources }) {
    return dataSources.owsUsers.removeDevice(input.deviceId);
  },
  async createVendorAgreement(_source, { input }, { dataSources }) {
    return dataSources.owsUsers.createVendorAgreement(input);
  },

  async followParticipant(
    _source,
    { input: { participantId } },
    { dataSources }
  ) {
    await dataSources.owsNotifications.subscribeParticipant({
      participantId,
      relationship: HAS_FOLLOWED,
    });
    const [
      { spotifyId, chartmetricId, name },
      ...rest
    ] = await dataSources.graphqlKnowledge.globalParticipantById({
      id: participantId,
    });
    return {
      id: participantId,
      chartmetricId,
      spotifyId,
      name,
    };
  },

  async unfollowParticipant(
    _source,
    { input: { participantId } },
    { dataSources }
  ) {
    await dataSources.owsNotifications.unsubscribeParticipant(
      participantId,
      HAS_FOLLOWED
    );
    const [
      { spotifyId, chartmetricId, name },
      ...rest
    ] = await dataSources.graphqlKnowledge.globalParticipantById({
      id: participantId,
    });
    return {
      id: participantId,
      chartmetricId,
      spotifyId,
      name,
    };
  },

  async linkParticipantSocialPlatformUrl(
    _source,
    { input: { participantId, callbackUrl, platform } },
    { dataSources }
  ) {
    const [
      { spotifyId },
      ...rest
    ] = await dataSources.graphqlKnowledge.globalParticipantById({
      id: participantId,
    });
    return dataSources.laylo.getVerifyArtistUrl({
      spotifyId,
      callbackUrl,
      platform,
    });
  },

  async unlinkParticipantSocialPlatform(
    _source,
    { input: { participantId, platform } },
    { dataSources }
  ) {
    const [
      { spotifyId, chartmetricId, name },
      ...rest
    ] = await dataSources.graphqlKnowledge.globalParticipantById({
      id: participantId,
    });
    await dataSources.laylo.removeArtistSocialLogin({ spotifyId, platform });
    return {
      id: participantId,
      chartmetricId,
      spotifyId,
      name,
    };
  },

  async instagramComment(
    _source,
    { input: { participantId, postId, comment } },
    { dataSources }
  ) {
    const [
      { spotifyId },
      ...rest
    ] = await dataSources.graphqlKnowledge.globalParticipantById({
      id: participantId,
    });
    if (
      await dataSources.laylo.instagramComment({ spotifyId, postId, comment })
    )
      return dataSources.laylo.getPostById({ postId });
    return null;
  },

  async subscribeByNotificationType() {
    // TODO: uncomment once we have the "subscribe" endpoint in owsNotifications
    // return dataSources.owsNotifications.subscribeByNotificationType(input);
    return true;
  },

  async unsubscribeByNotificationType(_source, { input }, { dataSources }) {
    return dataSources.owsNotifications.unsubscribeByNotificationType(input);
  },

  async updateProductDistributionTo(_source, { input }, { dataSources }) {
    return await dataSources.owsDistribution.updateProductDistributionTo(input);
  },
};

export default resolvers;
