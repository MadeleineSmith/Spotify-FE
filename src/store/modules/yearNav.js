const state = {
    // this default is overwritten in the CreateKillerPlaylist component
    yyyy: new Date().toISOString().substr(0, 4),
};

// getters
const getters = {
    yyyy: (state) => state.yyyy,
};

// actions
const actions = {};

// mutations
const mutations = {
    change(state, date) {
        state.yyyy = date;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
