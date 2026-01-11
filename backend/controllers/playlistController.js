export const createPlaylist = async (req, res) => {
  const playlist = await Playlist.create({
    name: req.body.name,
    userId: req.user.id,
  });
  res.json(playlist);
};

export const addToPlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  playlist.songs.push(req.body.songId);
  await playlist.save();
  res.json(playlist);
};

export const getUserPlaylists = async (req, res) => {
  const playlists = await Playlist.find({ userId: req.user.id })
    .populate("songs");
  res.json(playlists);
};
