import React, {
    Component
} from 'react';

class Cam extends Component {

    constructor(args) {
        super(args);
        this.markers = 0;
        this.state = {
            'markers': 0
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
        var video_element = document.getElementById('video');
        video_element.src = window.URL.createObjectURL(stream);
        video_element.play();
        var cameraParam = new window.ARCameraParam();
        var marker1,marker2,marker3;

        cameraParam.onload = function() {

            var interval = setInterval(function(){
                if(!video_element.videoWidth) return;
                if (!arController) {
                    arController = new window.ARController(video_element, cameraParam);
                    arController.setPatternDetectionMode(window.artoolkit.AR_TEMPLATE_MATCHING_MONO_AND_MATRIX);

                    arController.debugSetup();
                    arController.loadMarker('/data/patt.hiro', function(marker) {
                        //console.log('loaded marker', marker);

                        marker1 = marker;

                    });

                    // arController.loadMarker('/data/pattern-marker2.patt', function(marker) {
                    //     console.log('loaded marker', marker);
                    //     marker2 = marker;
                    //
                    // });
                    //
                    //
                    // arController.loadMarker('/data/pattern-marker3.patt', function(marker) {
                    //     console.log('loaded marker', marker);
                    //     marker3 = marker;
                    //
                    // });

                    arController.addEventListener('markerNum', function (markerNum) {
                        console.log('got markers', markerNum);
                    });

                    arController.addEventListener('getMarker', function(ev){
                    //    console.log(ev.data.marker.idPatt);
                        if(ev.data.marker.idPatt === marker1){
                            console.log('saw marker', ev.data.marker.idPatt);
        			        // console.log('transformation matrix', arController.getTransformationMatrix());
                        }
                    });

                }
                arController.process();

            },16);
            console.log(arController)
            // arController.loadMarker('/data/pattern-marker1.patt', function(marker) {
            //     console.log('loaded marker', marker);
            //     markerID = marker;
            //
            // });

            // arController.addEventListener('getMarker', function(ev){
            //     if(ev.marker.idPatt === markerID){
            //         console.log('saw marker', ev.data.marker);
			//         console.log('transformation matrix', arController.getTransformationMatrix());
            //     }
            // });


        };

        cameraParam.src = '/data/camera_para.dat';
    }

    errorCallback(e) {
        console.log("Can't access user media", e);
    }

    render() {
        return (
            <div className="ar-cam">
                <video id="video" width="640" />
                <div className = "ar-count-display" >#{this.state.markers}</div>
            </div>
        );
    }
}


export default Cam;
