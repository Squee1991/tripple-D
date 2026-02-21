import IphoneICon from '../assets/images/pwaIcons/IPhone.svg';
import AndroidICon from '../assets/images/pwaIcons/android.svg';
import PCICon from '../assets/images/pwaIcons/computer.svg';

export const pwaInstructions = [
	{
		id: 'ios',
		icon: IphoneICon,
		title: 'pwaInstructions.IosTitle',
		isList: true,
		steps: [
			'pwaInstructions.iosTipOne',
			'pwaInstructions.iosTipTwo',
			'pwaInstructions.iosTipThree'
		]
	},
	{
		id: 'android',
		icon: AndroidICon,
		title: 'pwaInstructions.androidTitle',
		isList: true,
		steps: [
			'pwaInstructions.androidTipOne',
			'pwaInstructions.androidTipTwo',
			'pwaInstructions.androidTipThree'
		]
	},
	{
		id: 'desktop',
		icon: PCICon,
		title: 'pwaInstructions.pcTitle',
		isList: false,
		steps: [
			'pwaInstructions.pcTipOne'
		]
	}
]