/*
	Generated from 500 worst passwords and 401 banned twiiter passwords as of 20150520.
	@source http://www.skullsecurity.org/wiki/index.php/Passwords

	Filtered to remove any passwords shorter than 4 characters, as these will cause
	unwanted behaviour when in strict banning mode.
	
	Total of 518 bad passwords.
*/
function rot47(x){
	var s = [];
	for (var i = 0; i < x.length; i ++) {
		var j = x.charCodeAt(i);
		if ((j >= 33) && (j <= 126))
			s[i] = String.fromCharCode(33 + ((j + 14) % 94));
		else
			s[i] = String.fromCharCode(j);
	}
	return s.join('');
}
COMPLEXIFY_BANLIST = rot47("______M````M`````M``````M````````M``aabbM`a`aM`a`a`aM`ab`abM`abcM`abcdM`abcdeM`abcdefM`abcdefgM`abcdefghM`b`bM`b`b`bMa___Ma``aMaaaaMabababMbbbbMc`agMcba`MccccMd`d_MddddMedcba`MeeeeMeeeeeeMehehMehehehMffffMffffffMfffffffMgefdb_hMhgfedcM2222M222222M234`abM234567M238CEJFM2446DDM2446DD`cM24E:@?M2=36CEM2=36CE@M2=6;2?5C2M2=6;2?5C@M2=6IM2=6I:DM2>2?52M2>2E6FCM2>6C:42M2?5C62M2?5C6HM2?86=M2?86=2M2?86=DM2?:>2=M2?E9@?JM2A@==@M2AA=6M2AA=6DM2CD6?2=M2CE9FCM2D57M2D5789M2D9=6JM2DD9@=6M2F8FDEM2FDE:?M323JM3253@JM32:=6JM32?2?2M32C?6JM32D632==M32E>2?M36249M362CM362EC:KM362G6CM362G:DM366CM3:84@4<M3:85255JM3:85:4<M3:85@8M3:8E:EDM3:==M3:==JM3:C5:6M3:E49M3:E496DM3:E6>6M3=24<M3=2K6CM3=@?56M3=@?56DM3=@H;@3M3=@H>6M3=F6M3@?5__fM3@?:E2M3@??:6M3@@3@@M3@@3DM3@@86CM3@@>6CM3@@EJM3@DE@?M3C2?5@?M3C2?5JM3C2G6DM3C2K:=M3C:2?M3C@?4@M3C@?4@DM3F332M3F55JM3F==5@8M3FDE6CM3FEE6CM3FEE9625M42=G:?M42>2C@M42>6C@?M42?252M42AE2:?M42C=@DM42CE6CM42DA6CM492C=6DM492C=:6M4966D6M496=D62M496DE6CM496GJM49:428@M49:4<6?M49C:DM4@424@=2M4@4<M4@7766M4@==686M4@>A2BM4@>AFE6CM4@?DF>6CM4@@<:6M4@@=M4@@A6CM4@CG6EE6M4@H3@JM4@H3@JDM4C62>M4CJDE2=M4F>>:?8M4F>D9@EM4F?EM52<@E2M52==2DM52?:6=M52?:6==6M52G6M52G:5M5633:6M56??:DM5:23=@M5:2>@?5M5:4<M5:CEJM5@4E@CM5@88:6M5@=A9:?M5@=A9:?DM5@?2=5M5C28@?M5C62>DM5C:G6CM628=6M628=6`M628=6DM65H2C5M6:?DE6:?M6?;@JM6?E6CM6C:4M6C@E:4M6DEC6==2M6IEC6>6M72=4@?M76?56CM76CC2C:M7:C6M7:C63:C5M7:D9M7:D9:?8M7=@C:52M7=@H6CM7=J6CDM7@@E32==M7@C5M7@C6G6CM7C2?<M7C65M7C655JM7C665@>M7F4<M7F4<65M7F4<6CM7F4<:?8M7F4<>6M7F4<J@FM82?52=7M82E6H2JM82E@CDM86>:?:M86@C86M8:2?EDM8:?86CM8:C=M8:C=DM8:K>@5@M8@=56?M8@=7M8@=76CM8@C5@?M8C62EM8C66?M8C68@CJM8F:E2CM8F??6CM92>>6CM92??29M92AAJM92C54@C6M92C=6JM962E96CM96==@M96=A>6M96?E2:M9@4<6JM9@@E6CDM9@C?6JM9@C?JM9@E5@8M9@FD6M9F?E6CM9F?E:?8M:46>2?M:=@G6J@FM:?E6C?6EM:H2?EFM;24<M;24<:6M;24<D@?M;28F2CM;2<6M;2>6DM;2A2?M;2D>:?6M;2D@?M;2DA6CM;6??:76CM;6C6>JM;6DD:42M;@9?M;@9??JM;@9?D@?M;@C52?M;@D6A9M;@D9F2M;F:46M;F?:@CM;FDE:?M<6==JM<6G:?M<:==6CM<:?8M<:EEJM<?:89EM=25:6DM=2<6CDM=2FC6?M=62E96CM=686?5M=6E>6:?M=:EE=6M=@?5@?M=@G6M=@G6CM=@G6CDM=F4<JM>255@8M>25:D@?M>288:6M>28:4M>28?F>M>2C:?6M>2C:A@D2M>2C<M>2C=3@C@M>2CE:?M>2CG:?M>2DE6CM>2EC:IM>2EEM>2EE96HM>2G6C:4<M>2IH6==M>6=:DD2M>6>36CM>6C4656DM>6C=:?M>:4926=M>:496==6M>:4<6JM>:5?:89EM>:<6M>:==6CM>:?6M>:DEC6DDM>@?6JM>@?:42M>@?<6JM>@?DE6CM>@C82?M>@E96CM>@F?E2:?M>@G:6M>F77:?M>FCA9JM>FD:4M>FDE2?8M?2<65M?2D42CM?2E92?M?2F89EJM?44`f_`M?6HJ@C<M?:49@=2DM?:4@=6M?:AA=6M?:AA=6DM@=:G6CM@C2?86M@Fg`aMA24<6CDMA2?E96CMA2?E:6DMA2C:DMA2C<6CMA2DDMA2DDH@C5MA2DDH@C5`MA2DDH@C5`aMA2DDH@C5`abMA2EC:4<MA2F=MA62496DMA62?FEMA6?:DMA6AA6CMA6E6CMA92?E@>MA9@6?:IMA=2J6CMA=62D6MA@@<:6MA@C?MA@C?@MA@CD496MA@H6CMAC:?46MAC:?46DDMAC:G2E6MAFCA=6MAFDD:6DMAFDDJMB2KHDIMBH6CEMBH6CEJMBH6CEJF:MC233:EMC2496=MC24:?8MC2:56CDMC2:?3@HMC2?86CMC2?86CDMC636442MC65D<:?DMC65D@IMC65H:?8DMC:492C5MC@36CEMC@36CE@MC@4<MC@4<6EMC@D63F5MCF??6CMCFD9a``aMCFDD:2MD2>2?E92MD2>>JMD2>D@?MD2?5C2MD2EFC?MD4@@3JMD4@@E6CMD4@CA:@MD4@CA:@?MD4@EEMD632DE:2?MD64C6EMD6ID6IMD6IJMD925@HMD92??@?MD92G65MD9:EMD:6CC2MD:=G6CMD<:AAJMD=2J6CMD=FEMD>:E9MD>@<6JMD?@@AJMD@446CMD@A9:6MDA2?<JMDA2C<JMDA:56CMDBF:CEMDC:?:G2DMDE2CMDE2CDMDE2CEC6<MDE2CH2CDMDE66=6CDMDE6G6MDE6G6?MDE:4<JMDEFA:5MDF446DDMDF4<:EMDF>>6CMDF?D9:?6MDFA6CMDFA6C>2?MDFC76CMDH:>>:?8MDJ5?6JME2J=@CME66?DME6??:DME6BF:6C@ME6C6D2ME6DEME6DE6CME6DE:?8ME96>2?ME9@>2DME9F?56CME9I``bgME:772?JME:86CME:86CDME:886CME:>6ME:EDME@>42EME@A8F?ME@J@E2MEC2G:DMEC@F3=6MECFDE?@`MEF4<6CMEFCE=6MEH:EE6CMF?:E65MG28:?2MG:4E@CMG:4E@C:2MG:56@MG:<:?8MG:A6CMG@@5@@MG@J286CMH2=E6CMH2CC:@CMH6=4@>6MH92E6G6CMH9:E6MH:==:2>MH:==:6MH:=D@?MH:??6CMH:?DE@?MH:?E6CMH:K2C5MH@=7MH@>6?MI2G:6CMIIIIMIIIIIMIIIIIIMIIIIIIIIMJ2>292MJ2?<66MJ2?<66DMJ6==@HMJ@F?8MKI4G3?MKI4G3?>MKKKKKK").split('|');