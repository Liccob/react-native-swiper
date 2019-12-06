import React from 'react';
import { View, StyleSheet, Dimensions, Animated, PanResponder, Image, Text } from 'react-native';
const BANNERS = [
	{
		bannerId: 1,
		title: '苏泊尔（SUPOR）电饭煲 电饭锅 5L大容量金属拉丝机身 24小时预约CFXB50FC833-75',
		imgUrl:
			'https://******.com/***/s220x220_jfs/t3256/151/636252417/183322/e206a9f8/57bc0719Ndb4806d7.jpg!q70.jpg',
		linkUrl: 'https://sale.***.com/m/act/cvJgdk3mbf7.html'
	},
	{
		bannerId: 2,
		title: '联想(Lenovo)小新Air 13.3英寸超轻薄笔记本电脑（I7-6500U 8G 256G PCIE SSD IPS FHD WIN10）金',
		imgUrl:
			'https://******.com/***/s220x220_jfs/t3175/224/3250631711/81777/f6716ef6/57ee3031N02c54784.jpg!q70.jpg',
		linkUrl: 'https://1.******.com/detail/next?itemId=1300000000000119106'
	},
	{
		bannerId: 3,
		title:
			'靖昕 美国泰迪熊大熊陈乔恩同款巨型毛绒玩具抱抱熊猫布娃娃大号公仔玩偶创意生日男友送女友 薰衣草色美国大熊 1米送小朋友',
		imgUrl:
			'https://******.com/***/s220x220_jfs/t3502/126/369381259/392727/a981efee/58073ea3Nd17e4952.jpg!q70.jpg',
		linkUrl: 'https://1.******.com/detail/next?itemId=1300000000000119106'
	},
	{
		bannerId: 4,
		title:
			'【买4免1 限时抢购】鱼嘴凉鞋浴室拖鞋男女夏季居家室内防滑厚底情侣家居洗澡简约塑料凉拖鞋 深蓝色鱼骨 42-43(适合41-42)',
		imgUrl:
			'https://******.com/***/s220x220_jfs/t2002/339/1803971441/287233/9b04a32c/56de94afN31752973.jpg!q70.jpg',
		linkUrl: 'https://1.******.com/detail/next?itemId=1300000000000119106'
	},
	{
		bannerId: 5,
		title: '六品堂颜真卿柳公权楷书欧阳询王羲之书法临摹字贴毛笔字帖字贴水写布仿宣纸加厚文房四宝套装 颜真卿多宝塔',
		imgUrl:
			'https://******.com/***/s220x220_jfs/t4459/167/1267569947/487008/e5bb4b8b/58db1676Ne5b5c54d.jpg!q70.jpg',
		linkUrl: 'https://1.******.com/detail/next?itemId=1300000000000119106'
	}
];

const { width } = Dimensions.get('window');
const dataLength = BANNERS.length;
const ImageWidth = (72 * width) / 375;
const PicAreaHeight = ImageWidth + 25;

export default class RankFloor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: BANNERS,
			isPlay: true,
			ScrollYValue: new Animated.Value(dataLength),
			currentPage: dataLength
		};
	}
	componentDidMount() {
		this._startAutoPlay();
	}
	_startAutoPlay = ()=> {
		if (!this._autoPlayer) {
			this._autoPlayer = setInterval(() => {
				this.movePage(1);
			}, this.props.interval || 1600);
		}
	}
	_stopAutoPlay = ()=> {
		if (this._autoPlayer) {
			clearInterval(this._autoPlayer);
			this._autoPlayer = null;
		}
	}
	movePage = step => {
		console.log('movepage', step);
		const { currentPage, ScrollYValue } = this.state;
		let toValue = currentPage + step;
		console.log(toValue, 'movepage 中应该move到的page');

		Animated.spring(ScrollYValue, { toValue: toValue, friction: 10, tension: 50, duration: 400 }).start(event => {
			if (event.finished) {
				console.log(110, 'spring动画结束', toValue, this.state.ScrollYValue);
				let currentPageNext = currentPage + step;
				if (currentPage + step < dataLength) {
					currentPageNext = currentPage + step + dataLength;
				} else if (currentPage + step > dataLength * 2 - 1) {
					currentPageNext = currentPage + step - dataLength;
				}
				console.log(currentPageNext, '转换后的页数');
				this.state.ScrollYValue.setValue(currentPageNext);
				this.setState({
					currentPage: currentPageNext,
					fling: false
				}, () => { 
					this._startAutoPlay();
				});
			}
		});
	};
	makeDataArr = () => {
		let arrMid = BANNERS.map((v, i) => {
			const t = Object.assign({}, v, { key: v.bannerId + 'mid' });
			return t;
		});
		let arrPre = BANNERS.map((v, i) => {
			const t = Object.assign({}, v, { key: v.bannerId + 'pre' });
			return t;
		});
		let arrAft = BANNERS.map((v, i) => {
			const t = Object.assign({}, v, { key: v.bannerId + 'aft' });
			return t;
		});
		// this.dataArr = [...arrPre, ...arrMid, ...arrAft];
		return [...arrPre, ...arrMid, ...arrAft];
	};

	renderPic = (item, index) => {
		const { ScrollYValue, currentPage } = this.state;
		const opacityTop = ScrollYValue.interpolate({
			inputRange: [0, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, 3 * dataLength - 1],
			outputRange: [0.2, 0.2, 1, 0.2, 0.2, 0.2]
		});
		const opacityMid = ScrollYValue.interpolate({
			inputRange: [0, currentPage - 1, currentPage, currentPage + 1, 3 * dataLength - 1],
			outputRange: [0.2, 0.2, 1, 0.2, 0.2]
		});
		const opacityBot = ScrollYValue.interpolate({
			inputRange: [0, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, 3 * dataLength - 1],
			outputRange: [0.2, 0.2, 0.2, 1, 0.2, 0.2]
		});
		let opacityValue = 0.2;
		if (currentPage == index) {
			opacityValue = opacityMid;
		} else if (currentPage == index + 1) {
			opacityValue = opacityTop;
		} else if (currentPage == index - 1) {
			opacityValue = opacityBot;
		}
		return (
			<Animated.View
				style={[
					styles.ImageWrap,
					{
						opacity: opacityValue
					}
				]}
			>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Image style={styles.Pic} size={ImageWidth} source={ite***imgUrl} />
					<Text style={{ height: 20, marginTop: 4, fontSize: 14 }}>{ite***bannerId}</Text>
				</View>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Image style={styles.Pic} size={ImageWidth} source={ite***imgUrl} />
					<Text style={{ height: 20, marginTop: 4, fontSize: 14 }}>{ite***bannerId}</Text>
				</View>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Image style={styles.Pic} size={ImageWidth} source={ite***imgUrl} />
					<Text style={{ height: 20, marginTop: 4, fontSize: 14 }}>{ite***bannerId}</Text>
				</View>
			</Animated.View>
		);
	};

	// 在渲染title区域时 需要处理的问题就是随着inputRange的变化 不仅需要scale的渐变，还需要有opacity的改变
	// 这里我们分开处理
	// 处理scale的思路：判断currentPage和inde的关系 来判断是否需要放大缩小?还涉及到一个outputRange 是一个范围
	renderTitle = (item, index) => {
		const { ScrollYValue, currentPage } = this.state;
		// 实际上title的currentPage比图片的currentPage要后面一个
		const scaleTop = ScrollYValue.interpolate({
			inputRange: [0, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, 3 * dataLength - 1],
			outputRange: [0.8, 0.8, 1, 0.8, 0.8, 0.8]
		});
		const scaleMid = ScrollYValue.interpolate({
			inputRange: [0, currentPage - 1, currentPage, currentPage + 1, 3 * dataLength - 1],
			outputRange: [0.8, 0.8, 1, 0.8, 0.8]
		});
		const scaleBot = ScrollYValue.interpolate({
			inputRange: [0, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, 3 * dataLength - 1],
			outputRange: [0.8, 0.8, 0.8, 1, 0.8, 0.8]
		});
		let scaleValue = 0.8;
		if (currentPage == index) {
			scaleValue = scaleMid;
		} else if (currentPage == index + 1) {
			scaleValue = scaleTop;
		} else if (currentPage == index - 1) {
			scaleValue = scaleBot;
		}

		const opacityTop = ScrollYValue.interpolate({
			inputRange: [0, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, 3 * dataLength - 1],
			outputRange: [0.2, 0.2, 1, 0.2, 0.2, 0.2]
		});
		const opacityMid = ScrollYValue.interpolate({
			inputRange: [0, currentPage - 1, currentPage, currentPage + 1, 3 * dataLength - 1],
			outputRange: [0.2, 0.2, 1, 0.2, 0.2]
		});
		const opacityBot = ScrollYValue.interpolate({
			inputRange: [0, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, 3 * dataLength - 1],
			outputRange: [0.2, 0.2, 0.2, 1, 0.2, 0.2]
		});
		let opacityValue = 0.2;
		if (currentPage == index) {
			opacityValue = opacityMid;
		} else if (currentPage == index + 1) {
			opacityValue = opacityTop;
		} else if (currentPage == index - 1) {
			opacityValue = opacityBot;
		}
		return (
			<Animated.View
				style={{
					borderRadius: 20,
					backgroundColor: '#F1D167',
					overflow: 'hidden',
					transform: [{ scaleX: scaleValue }, { scaleY: scaleValue }],
					opacity: opacityValue,
					paddingHorizontal: 4,
					paddingVertical: 1
				}}
			>
				<Text style={{ color: '#FFF', fontSize: 12, height: 18, lineHeighgt: 16 }}>
					{'ite***brandId' + ite***bannerId}
				</Text>
			</Animated.View>
		);
	};

	render() {
		const { page } = this.props;
		const { currentPage } = this.state;
		const release = (e, gestureState) => {
			var relativeGestureDistance = gestureState.dy / PicAreaHeight,
				vy = gestureState.vy * 1000000;
			var step = 0;
			if (relativeGestureDistance < -0.5 || (relativeGestureDistance < 0 && vy <= -0.3)) {
				step = 1;
			} else if (relativeGestureDistance > 0.5 || (relativeGestureDistance > 0 && vy >= 0.3)) {
				step = -1;
			}
			console.log('release and movePage');
			this.movePage(step);
			// 恢复首页滚动
		};
		const dataSource = this.makeDataArr();
		const responder = PanResponder.create({
			onMoveShouldSetPanResponder: (event, gesture) => {
				const { dy } = gesture; // dx dy 从触碰屏幕坐标开始算
				console.log('touch start');
				// if (Math.abs(dy) < 3) {
				// 	return false;
				// }
				// 使首页禁止滚动
				this._stopAutoPlay();
				return true;
			},
			onPanResponderMove: (event, gesture) => {
				const { dy } = gesture;
				// 轮播的循环 todo
				this.state.ScrollYValue.setValue(currentPage + -dy / PicAreaHeight);
				console.log(currentPage + dy / PicAreaHeight, 'move 中的scrollvalue');
			},
			onPanResponderRelease: release,
			onPanResponderTerminate: release,
			onPanResponderTerminationRequest: () => {
				console.log('terminate request');
				return false;
			}
		});
		// 右边图片区域 从datalength处开始轮播：到2*dataLength处为一组 outputRange为 dateLength * 60(高度)
		const translateY = this.state.ScrollYValue.interpolate({
			inputRange: [dataLength - 1, dataLength * 2 - 1],
			outputRange: [-(dataLength - 1) * PicAreaHeight, -(2 * dataLength - 1) * PicAreaHeight]
		});
		const translateYTitle = this.state.ScrollYValue.interpolate({
			inputRange: [dataLength - 1, dataLength * 2 - 1],
			outputRange: [-(dataLength - 2) * 20, -(2 * dataLength - 2) * 20]
		});
		return (
			<View
				style={{
					overflow: 'hidden',
					height: PicAreaHeight,
					flex: 1,
					flexDirection: 'row',
					paddingHorizontal: 12,
					marginVertical: 20
					// backgroundColor:'#FFF'
				}}
				{...responder.panHandlers}
			>
				<View
					style={{
						marginTop: (ImageWidth - 60) / 2,
						overflow: 'hidden',
						height: 60,
						width: 107
					}}
				>
					<Animated.View
						style={{
							transform: [{ translateY: translateYTitle }],
							justifyContent: 'flex-start',
							alignItems: 'flex-start'
						}}
					>
						{dataSource.map((v, i) => {
							return (
								<View style={styles.itemWrap2} key={v.key}>
									{this.renderTitle(v, i)}
								</View>
							);
						})}
					</Animated.View>
				</View>
				<View
					style={{
						overflow: 'hidden',
						height: PicAreaHeight,
						flex: 1
					}}
				>
					<Animated.View
						style={{
							transform: [{ translateY: translateY }]
						}}
					>
						{dataSource.map((v, i) => {
							return (
								<View style={styles.itemWrap} key={v.key}>
									{this.renderPic(v, i)}
								</View>
							);
						})}
					</Animated.View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		paddingHorizontal: 12
	},
	itemWrap: {
		justifyContent: 'center',
		alignItems: 'center',
		height: PicAreaHeight
		// flex:1
	},
	itemWrap2: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		height: 20,
		paddingLeft: 12

		// marginVertical: 2
	},
	ImageWrap: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%'
	},
	Pic: {
		borderRadius: 12,
		overflow: 'hidden'
	}
});
