import React, {
    Component
} from 'react';

class Cam extends Component {

    constructor(args) {
        super(args);
        this.state = {
            marker1: 0,
            marker2:0,
            marker3:0
        };
        this.success = this.success.bind(this);
    }

    componentDidMount() {

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        var tw = 800;
        var th = 600;

        var hdConstraints = {
            audio: false,
            video: {
                mandatory: {
                    maxWidth: tw,
                    maxHeight: th
                }
            }
        };

        if (navigator.getUserMedia) {
            navigator.getUserMedia(hdConstraints, this.success, this.errorCallback, this);
        } else {
            this.errorCallback('');
        }
    }

    success(stream) {

        var arController;
        var self = this;
        var video_element = document.getElementById('video');
        video_element.src = window.URL.createObjectURL(stream);
        video_element.play();
        var cameraParam = new window.ARCameraParam();
        var marker1,marker2,marker3;
        var markers_array = [];

        cameraParam.onload = function() {

            var interval = setInterval(function(){
                if(!video_element.videoWidth) return;

                if (!arController) {
                    arController = new window.ARController(video_element, cameraParam);
                    arController.setPatternDetectionMode(window.artoolkit.AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX);
                    //arController.debugSetup();


                    arController.loadMarker('/data/1.pat', function(marker) {
                        console.log('loaded marker', marker);
                        marker1 = marker;
                    });

                    arController.loadMarker('/data/2.pat', function(marker) {
                        console.log('loaded marker', marker);
                        marker2 = marker;
                    });


                    arController.loadMarker('/data/3.pat', function(marker) {
                        console.log('loaded marker', marker);
                        marker3 = marker;
                    });

                    var num_marker1 = 0;
                    var num_marker2 = 0;
                    var num_marker3 = 0;

                    arController.addEventListener('getMarker', function(ev){

                        var marker_num = this.getMarkerNum();

                        num_marker1 = 0;
                        num_marker2 = 0;
                        num_marker3 = 0;

                		for (var i=0; i<marker_num; i++) {
                            var marker = this.getMarker(i);
                            switch(marker.idPatt){
                                case marker1:
                                    num_marker1 ++;
                                    break;
                                case marker2:
                                    num_marker2++;
                                    break;
                                case marker3:
                                    num_marker3++;
                                    break;
                            }
                		}

                        self.setState({
                            marker1:num_marker1,
                            marker2:num_marker2,
                            marker3:num_marker3
                        });
                    });

                }

                arController.process();

                if(arController.getMarkerNum() < 1 ) {
                     num_marker1 = 0;
                     num_marker2 = 0;
                     num_marker3 = 0;

                     self.setState({
                         marker1:num_marker1,
                         marker2:num_marker2,
                         marker3:num_marker3
                     });
                }
                //console.log(arController.getMarkerNum())

            },200);

        };

        cameraParam.src = '/data/camera_para.dat';
    }


    check_array_num() {

    }

    errorCallback(e) {
        console.log("Can't access user media", e);
    }

    render() {
        return (
            <div className="ar-cam">
                <video id="video" width="640" />
                <div className = "ar-count-display" >
                    <div className="container">
                        <div className="col-md-4">
                        <img src={process.env.PUBLIC_URL + '/img/1-M.png'} alt="M1" className="img img-responsive"/>
                            #{this.state.marker1}
                        </div>
                        <div className="col-md-4">
                            <img src={process.env.PUBLIC_URL + '/img/2-M.png'} alt="M2" className="img img-responsive"/>
                            #{this.state.marker2}
                        </div>
                        <div className="col-md-4">
                            <img src={process.env.PUBLIC_URL + '/img/3-M.png'} alt="M3" className="img img-responsive"/>
                            #{this.state.marker3}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Cam;
