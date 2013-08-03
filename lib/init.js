var amuzPlayer = new AmuzPlayer({container: document.getElementById('youtubePlayer')});
amuzPlayer.on('ready', function(){
  this.addItem(new YoutubeVideo({title:"Hanuman", duration:243, id: 'ENBX_v1Po1Y'}));
  this.addItem(new YoutubeVideo({title:"Floreio Art", duration:155, id: 'mwF1mUa8c5E'}));
  this.addItem(new YoutubeVideo({title:"H-arlem Shake", duration:29, id: 'rU1OpD2r0Is'}));
  this.addItem(new YoutubeVideo({title:"La bruja", duration:117, id: 'tUHTx-9xC8c'}));
  this.addItem(new YoutubeVideo({title:"The most amazing pitch ever", duration:243, id: 'caAz3FJs44w'}));
  this.addItem(new YoutubeVideo({title:"Hanuman", duration:243, id: 'ENBX_v1Po1Y'}));
  this.addItem(new YoutubeVideo({title:"Floreio Art", duration:155, id: 'mwF1mUa8c5E'}));
  this.addItem(new YoutubeVideo({title:"H-arlem Shake", duration:29, id: 'rU1OpD2r0Is'}));
  this.addItem(new YoutubeVideo({title:"La bruja", duration:117, id: 'tUHTx-9xC8c'}));
  this.addItem(new YoutubeVideo({title:"The most amazing pitch ever", duration:243, id: 'caAz3FJs44w'}));
  this.addItem(new YoutubeVideo({title:"Hanuman", duration:243, id: 'ENBX_v1Po1Y'}));
  this.addItem(new YoutubeVideo({title:"Floreio Art", duration:155, id: 'mwF1mUa8c5E'}));
  this.addItem(new YoutubeVideo({title:"H-arlem Shake", duration:29, id: 'rU1OpD2r0Is'}));
  this.addItem(new YoutubeVideo({title:"La bruja", duration:117, id: 'tUHTx-9xC8c'}));
  this.addItem(new YoutubeVideo({title:"The most amazing pitch ever", duration:243, id: 'caAz3FJs44w'}));
  this.addItem(new YoutubeVideo({title:"Hanuman", duration:243, id: 'ENBX_v1Po1Y'}));
  this.addItem(new YoutubeVideo({title:"Floreio Art", duration:155, id: 'mwF1mUa8c5E'}));
  this.addItem(new YoutubeVideo({title:"H-arlem Shake", duration:29, id: 'rU1OpD2r0Is'}));
  this.addItem(new YoutubeVideo({title:"La bruja", duration:117, id: 'tUHTx-9xC8c'}));
  this.addItem(new YoutubeVideo({title:"The most amazing pitch ever", duration:243, id: 'caAz3FJs44w'}));
  this.addItem(new YoutubeVideo({title:"Hanuman", duration:243, id: 'ENBX_v1Po1Y'}));
  this.addItem(new YoutubeVideo({title:"Floreio Art", duration:155, id: 'mwF1mUa8c5E'}));
  this.addItem(new YoutubeVideo({title:"H-arlem Shake", duration:29, id: 'rU1OpD2r0Is'}));
  this.addItem(new YoutubeVideo({title:"La bruja", duration:117, id: 'tUHTx-9xC8c'}));
  this.addItem(new YoutubeVideo({title:"The most amazing pitch ever", duration:243, id: 'caAz3FJs44w'}));

  for (var i=0;i<20;i++)
    this.removeItem(0);
  this.volume(100);
});