import React, {
    Component
} from 'react';

class Cam extends Component {

    constructor(args) {
        super(args);
        this.markers = 0;
        this.state = {'markers':0};
        this.success = this.success.bind(this);
    }

    componentDidMount() {

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        var tw = 720 / 2;
        var th = 480 / 2;

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
            navigator.getUserMedia(hdConstraints, this.success, this.errorCallback,this);
        } else {
            this.errorCallback('');
        }
    }

    success(stream) {

        var self  = this;
        var arController;
        var  video_element= document.getElementById('video');
        video_element.src = window.URL.createObjectURL(stream);
        video_element.play();
        var cameraParam = new window.ARCameraParam();

        cameraParam.onload = function() {
            var interval = setInterval(function() {
                if (!video_element.videoWidth)	return;

                if (!arController) {
                    arController = new window.ARController(video_element, cameraParam);
                    arController.setPatternDetectionMode(window.artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX);
                    arController.debugSetup();
                }

                arController.process();
                self.setState( {'markers' : arController.getMarkerNum()} );

            }, 16);


        };
        cameraParam.src = '/data/camera_para.dat';
    }

    errorCallback(e) {
        console.log("Can't access user media", e);
    }

    render() {
        return (
            <div className="ar-cam">
            <video id="video"/>
            <div className="ar-count-display"># {this.state.markers}</div>
            </div>
        );
    }
}


export default Cam;
