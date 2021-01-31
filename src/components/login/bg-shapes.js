import styled from 'styled-components';
import {
	BgLandingTop,
	BgLightLandingTop,
	BgLandingBottom,
} from '../../assets/bg-landing';

const ShapeTopWrapper = styled.div`
	position: absolute;
	right: -15%;
	top: -18%;
	width: 43%;
	transform: rotateZ(-13deg);
`;
const ShapeTopLightWrapper = styled.div`
	position: absolute;
	right: -15%;
	top: -17%;
	width: 43%;
	transform: rotateZ(-20deg);
	z-index: -1;
`;

const ShapeBottomWrapper = styled.div`
	position: absolute;
	left: -12%;
	bottom: -40%;
	width: 45%;
	transform: rotateZ(-147deg);
`;
const BgShapes = () => {
	return (
		<>
			<ShapeTopWrapper>
				<BgLandingTop />
			</ShapeTopWrapper>
			<ShapeTopLightWrapper>
				<BgLightLandingTop />
			</ShapeTopLightWrapper>
			<ShapeBottomWrapper>
				<BgLandingBottom />
			</ShapeBottomWrapper>
		</>
	);
};
export default BgShapes;
