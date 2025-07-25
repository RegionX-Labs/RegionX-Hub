import {
  StorageDescriptor,
  PlainDescriptor,
  TxDescriptor,
  RuntimeDescriptor,
  Enum,
  ApisFromDef,
  QueryFromPalletsDef,
  TxFromPalletsDef,
  EventsFromPalletsDef,
  ErrorsFromPalletsDef,
  ConstFromPalletsDef,
  ViewFnsFromPalletsDef,
  SS58String,
  FixedSizeBinary,
  Binary,
  FixedSizeArray,
} from 'polkadot-api';
import {
  I5sesotjlssv2d,
  Iffmde3ekjedi9,
  I4mddgoa69c0a2,
  I1gnb9aeieaesd,
  I95g6i7ilua7lq,
  Ieniouoqkq4icf,
  Phase,
  Ibgl04rn6nbfm6,
  I3geksg000c171,
  BabeDigestsNextConfigDescriptor,
  Ic5m5lp1oioo8r,
  Idq7or56ds2f13,
  I4s6vifaf8k998,
  I9jd27rnpm8ttv,
  I8jnd4d8ip6djo,
  Ifip05kcrl65am,
  Iff9heri56m1mb,
  I1q8tnt1cluu5j,
  I8ds64oj6581v0,
  Ia7pdug7cdsg8g,
  Ib6k3oakd0jfsr,
  I2l1ctuihi2mfd,
  TransactionPaymentReleases,
  Ia2lhg7l2hilo3,
  Ic12aht5vh2sen,
  StakingRewardDestination,
  I9o7ssi9vmhmgr,
  Ic3m9d6tdl6gi2,
  Ib3j7gb0jgs38u,
  Ifekshcrgkl12g,
  I7svnfko10tq2e,
  I6flrronqs3l6n,
  I97fulj5h3ik95,
  Ia8896dq44k9m4,
  Icgljjb6j82uhn,
  Iff9p3c7k6pfoi,
  StakingForcing,
  Iafq6t4rgheait,
  I4ojmnsk1dchql,
  Iinkhfdlka9ch,
  I2kj4j6mp68hf8,
  I6ouflveob4eli,
  I2bqvqrg0sbrdj,
  I23nq3fsgtejt,
  I4pact7n2e9a0i,
  Idt624nf41g34e,
  I9kr8cseidc66h,
  I82jm9g7pufuel,
  GrandpaStoredState,
  I7pe2me3i3vtn9,
  Iegmj7n48sc3am,
  I5v9a2mdqq4t8u,
  ConvictionVotingVoteVoting,
  If9jidduiuq7vv,
  I85t6l9pssiov4,
  I5g2vv0ckl2m8b,
  I3gg47bgkgq9tr,
  Icousgkbefm7ke,
  Iddckvbdfdasmv,
  I5ps9qbqlvun7q,
  I2phecamkn3pej,
  ClaimsStatementKind,
  I9hkvi4k3kh916,
  Iam8qhv8b3jn4n,
  I1659sf24o6ga8,
  Iehiasr6uoqbq,
  I8adv0j4q3uu5d,
  I7d29ossbog0d3,
  I2na29tt2afp0j,
  I7mgf69gvksvu2,
  I3sfg6klg56vmk,
  Ibprd8oi8phm62,
  Idlqqo993i780l,
  Ifble4juuml5ig,
  Version,
  Ic836nv7r3fq4i,
  I56u24ncejr5kt,
  I4pnnts4ec8rh0,
  I9p9lq3rej5bhc,
  Iag146hmjgqfgj,
  I8uo3fpd3bcc6f,
  PreimageOldRequestStatus,
  PreimageRequestStatus,
  I8phqps8r3of7e,
  Ibofbvvaehln4e,
  ElectionProviderMultiPhasePhase,
  Ictkaqdbfabuek,
  Ia7o65280hur3p,
  Iasd2iat48n080,
  Ic8d01sg6acf60,
  I84stt310eb6c3,
  I8s6n43okuj2b1,
  I2cqtnj49ogo81,
  I7btpfdeli5ea8,
  Ic79q40j9qptgh,
  I9bin2jc70qt6q,
  Ic5t26f9cp3tvk,
  I39k39h6vu4hbq,
  Idphjddn2h69vc,
  Idhh9vuu2bderg,
  If6qa32dj75gu1,
  I7oo2mprv1qd1s,
  NominationPoolsClaimPermission,
  I2eh80qovrl7h2,
  I542q009qbgt8k,
  I4e5ujckjq61g8,
  Idinvj2ldfa0k7,
  I78k2970vpbt1t,
  I27il479s8gsv0,
  Id375uoldedict,
  Ilg2fqs6cjgs3,
  Iarlj3qd8u1v13,
  I2ng2krd94ceva,
  Ie18mk3nmrn3nr,
  I4vk12npmr8ll0,
  ParachainsParasParaLifecycle,
  I79cs1p3m59mo7,
  UpgradeGoAhead,
  UpgradeRestriction,
  I2duhnt686rv0q,
  I7ulu3h1ibu60i,
  I6ljjd4b5fa4ov,
  Ibhmrlkcu01imb,
  I50mrcbubp554e,
  Id43g4eveajpkl,
  I7iua3ehrgl4va,
  Iev3u09i2vqn93,
  I9olhgo2o08h7b,
  I9m4rd2a7lc9md,
  I80rnntpog8qp6,
  I87u7jalc0lhah,
  I4p5t2krb1gmvp,
  I4arjljr6dpflb,
  I5kqchhvguhfvt,
  I4akf1ifqeclef,
  Ido5stnsbghtpd,
  I3ndpvu09rj685,
  Iafqnechp3omqg,
  I9dasmua8326io,
  I3g90iebhds6kb,
  I3av628q6dt6mq,
  Ifmaahl40gom3g,
  I70iuri2ilha1f,
  I6gun5k9fbb4s0,
  XcmPalletQueryStatus,
  Ic4qvh5df9s5gp,
  I7vlvrrl2pnbgk,
  I50sjs3s5lud21,
  XcmPalletVersionMigrationStage,
  I50qp0ij7h62g2,
  Iteuj23is2ed5,
  I3rp19gb4dadaa,
  Iegrepoo0c1jc5,
  I260m120dp9sbk,
  ParachainsInclusionAggregateMessageOrigin,
  I53esa2ms463bk,
  I1lfimt2mpej64,
  VersionedLocatableAsset,
  I2fb54desdqd9n,
  Idjett00s2gd,
  In7a38730s6qs,
  If15el53dd76v9,
  I9s0ave7t0vnrk,
  Ic6nglu2db2c36,
  Ibafpkl9hhno69,
  I4q39t5hn830vp,
  I35p85j063s0il,
  I6cs1itejju2vv,
  XcmV3Junctions,
  Iasb8k6ash5mjn,
  I8ofcg5rbj0g2c,
  I4adgbll7gku4i,
  I6pjjpfvhvcfru,
  I9pj91mj79qekl,
  I39uah9nss64h9,
  Ik64dknsq7k08,
  Ib51vk42m1po4n,
  I50ppnqasq4tjq,
  I9fin09kkg0jaj,
  Idcr6u6361oad9,
  I666bl2fqjkejo,
  I6o1er683vod1j,
  I5bq561t4gpfva,
  I4ktuaksf5i1gk,
  I9bqtpv2ii35mp,
  I9j7pagd6d4bda,
  I2h9pmio37r7fb,
  Ibmr18suc9ikh9,
  I9iq22t0burs89,
  I5u8olqbbvfnvf,
  I5utcetro501ir,
  I2eip8tc75dpje,
  I564va64vtidbq,
  Ie5v6njpckr05b,
  I328av3j0bgmjb,
  I4tuqm9ato907i,
  Iagi89qt4h1lqg,
  I9dgmcnuamt5p8,
  I3vh014cqgmrfd,
  Ifhs60omlhvt3,
  If34udpd5e57vi,
  I39t01nnod9109,
  Ie5vbnd9198quk,
  I3h6murn8bd4v5,
  I6k6jf8ncesuu3,
  I3qhk481i120pk,
  If1qr0kbbl298c,
  Idl3umm12u5pa,
  I5ont0141q9ss5,
  Ie6j49utvii126,
  I3v6ks33uluhnj,
  I3kiiim1cds68i,
  I4k60mkh2r6jjg,
  I5oi8saufice6j,
  I7ne83r38c2sqq,
  I2hviml3snvhhn,
  Icnrv1mfbd3in1,
  Icm9m0qeemu66d,
  Ibv74ul0c0qf0f,
  Idnsr2pndm36h0,
  Ia1pvdcbhuqf8m,
  I8steo882k7qns,
  I4pa4q37gj6fua,
  I5f178ab6b89t3,
  I4nakhtbsk3c5s,
  I4dvjo4haia091,
  Icbio0e1f0034b,
  I8c0vkqjjipnuj,
  I59bngqm85b22v,
  I3amdclkdfaipk,
  I8bvk21lpmah75,
  I449n3riv6jbum,
  I9a7qiue67urvk,
  I1adbcfi5uc62r,
  Ibf6ucefn8fh49,
  I1r6n193nfcjlk,
  I65ea24ohl89b2,
  I6uag8j5aql8q,
  Isq3k9rh2c0l4,
  I1dqiovk0tpoah,
  I1ntko0oih7v1a,
  I2tf5qmg09624f,
  Igpdat480l5fi,
  I1pca80gmdvp3r,
  Ifb92raqltbcv9,
  I5v36mpdeqskbu,
  Ibvkbvbkttt0k5,
  I8i12uisk6j7l,
  I26anifrfnljoi,
  I3qt1hgg4djhgb,
  I6a6f85pb71ums,
  I96p6guspeq6t,
  I4b66js88p45m8,
  Ieh40op1lafir9,
  Icjp7f9u9fno72,
  I41h4m4lrp9r4e,
  I7pqmhr25d3dqq,
  I6s6ihmfj6j5qq,
  Ic6cqd9g0t65v0,
  I7ka1pdlbuevh2,
  Id9uqtigc0il3v,
  Iaa2o6cgjdpdn5,
  Iam6hrl7ptd85l,
  Ict9ivhr2c5hv0,
  I8t4vv03357lk9,
  Ife5d90tgvboq0,
  I5n4sebgkfr760,
  I6biebuseb0v39,
  Ifs1i5fk9cqvr6,
  I73s5dmcaiqpls,
  Ic8nm7jnv6jeul,
  Ieg3fd8p4pkt10,
  I8kg5ll427kfqq,
  I467333262q1l9,
  I67o1b46l3uf5e,
  I81psug9dsrjik,
  Ifd1qham1gpgjc,
  I68ehmckmhc2ki,
  I2eb501t8s6hsq,
  Ianmuoljk2sk1u,
  Ifhdf5gi90p0p8,
  I766vif45kghl0,
  Iipbtt8d3t5ht,
  Ideaemvoneh309,
  I3d9o9d7epp66v,
  I82nfqfkd48n10,
  I1jm8m1rh9e20v,
  I3o5j3bli1pd8e,
  I2a839vbf5817q,
  Ia9p5bg6p18r0i,
  I42bqh279uf7oa,
  I4p6v96cffstms,
  I90n6nnkpdahrh,
  I8mk5kjgn02hi8,
  Ieqvq91sbe02ko,
  I2gr10p66od9ch,
  I9mcq66cm3gibo,
  Ic50i89t5eabvg,
  I80q14um2s2ckg,
  I5qs1t1erfi7u8,
  I2ou0mtsgm3l71,
  Ifsme8miqq9006,
  Icckjru8f8flpj,
  Iba38lgbjrs7je,
  Id9js0aucdivjk,
  I1vj3e1a62je3o,
  I6c1t14l6giceg,
  Ieg1oc56mamrl5,
  I2vu5vj7173ik9,
  I6galqkn58q3bl,
  I36uoc8t9liv80,
  Ibunghsg9qa7f7,
  I8qnouj2c0igph,
  Ic30e2k517a3ns,
  I47a2tsd2o2b1c,
  Ifc9k1s0e9nv8e,
  I4ihj26hl75e5p,
  I2dl8ekhm2t22h,
  I13us5e5h5645o,
  I931cottvong90,
  I7sujb8gfvuo7n,
  I1ors0vru14it3,
  I40s11r8nagn2g,
  I6bjj87fr5g9nl,
  I8cbluptqo8kbp,
  I81cc4plffa1dm,
  I3ihan8icf0c5k,
  I7ibh0fckqou49,
  I9j0ul7nh7b8jv,
  Id581arok0b1nj,
  I9jsikd1ghmc7l,
  I2f6mha3v4ooda,
  Iasqjdhasi408s,
  I6krn2lsleo87n,
  Iaid4btmkr5thp,
  I559fv6um7nmhd,
  Ibbf0j7ol2abrv,
  I1k3urvkqqshbc,
  I2ff0ffsh15vej,
  I1orfg86bkg123,
  Iaus4cb3drhu9q,
  Ivnsat10lv9d6,
  Ibncli8qttt2c2,
  I33rft6ag34efs,
  I9tmok5kceg2bg,
  I85icj2qbjeqbe,
  Ibuhbp68e6tkct,
  Idrevppfiubhve,
  I9s2h36kr71vk9,
  I4lkbiubo9ogq9,
  Id1baei7m8gkhk,
  I96ftepqm4vs7m,
  Ic3430470j4mbv,
  Ic3n7nqb6fffo0,
  I437u7rqtshfms,
  Iaa7g3f5tlv3gf,
  I7mf0sij342109,
  Ibvirp862qkkup,
  Ic5b47dj4coa3r,
  Idehabrqi23sc0,
  Idfpo6162k0hq,
  I19hvnphoaj44l,
  I1ng31ej27mh4k,
  I85qkvekflgteq,
  I1qt5nua7ua655,
  Ia1u3jll6a06ae,
  I7cl9esn1l72m7,
  Id68sq6o2gm8qi,
  Iafscmv8tjf0ou,
  Ibtsa3docbr9el,
  I2gpmmfdqv3cdc,
  I9paqujeb1fpv6,
  Iakevv83i18n4r,
  If2ssl12kcglhg,
  Iabk8ljl5g8c86,
  Ic76kfh5ebqkpl,
  Icrujen33bbibf,
  I5gi8h3e5lkbeq,
  Ibgm4rnf22lal1,
  I8mmaab8je28oo,
  I6r0pr82pbiftt,
  Ibv4ep0hngvn9e,
  Ieoqregtp7b00,
  I6nmp4rhqla35,
  I8ndstn7sf4kek,
  I3pirohb0sp3ic,
  Iemqna2uucuei9,
  Idrvp50hbkv2k2,
  Ie11u326g2gsj3,
  Ia82mnkmeo2rhc,
  Idj4durc8hq327,
  Icbccs0ug47ilf,
  I855j4i3kr8ko1,
  Icv68aq8841478,
  Ic262ibdoec56a,
  Iflcfm9b6nlmdd,
  Ijrsf4mnp3eka,
  Id5fm4p8lj5qgi,
  I8tjvj9uq4b7hi,
  I4cbvqmqadhrea,
  I4fooe9dun9o0t,
  Ier2cke86dqbr2,
  I1au3fq4n84nv3,
  Iejaj7m7qka9tr,
  Idnak900lt5lm8,
  I27n7lbd66730p,
  I2hq50pu2kdjpo,
  Ifk8eme5o7mukf,
  Iau4cgm6ih61cf,
  I6ir616rur362k,
  Ic19as7nbst738,
  I54umskavgc9du,
  I2ip7o9e2tc5sf,
  I5egvk6hadac5h,
  Iempvdlhc5ih6g,
  I5768ac424h061,
  I8iksqi3eani0a,
  I16enopmju1p0q,
  I43kq8qudg7pq9,
  I76riseemre533,
  I38bmcrmh852rk,
  I4hcillge8de5f,
  If52u7u3r3ve0n,
  Iek7v4hrgnq6iv,
  I9qfchhljqsjjl,
  I229ijht536qdu,
  I62nte77gksm0f,
  I9cg2delv92pvq,
  Ilhp45uime5tp,
  I4f1hv034jf1dt,
  Im1pm2vf6llcn,
  I21jsoeb0o6476,
  Ier6ck0tpfo7,
  Ic6ecdcp9ut7jd,
  I27notaksll8qt,
  I43hb96cjhbuft,
  I6nr1tkv231n8k,
  Ie3hcrrq6r18fs,
  I3ukv7eis0l0rp,
  I8s7sjg2dqn1fq,
  I9s9use9eb8ti8,
  I8ircspqpe79k7,
  I1vlt8l6nvnen6,
  I72vf0j9juc1df,
  Ie0phfcvllr4od,
  I476ep66p6ddg1,
  Ie3gphha4ejh40,
  If0btdsid69rrm,
  Ictusacdcqj61u,
  Ibsolu3c3q1lb4,
  Ib116djgo9u4uo,
  I9vkkue6cq74et,
  Ibu56t5h1q49i4,
  I1dmtl5t34b9g,
  Ievr89968437gm,
  I25vntc99qsnov,
  Ia3c82eadg79bj,
  Ienusoeb625ftq,
  Iub732oamcqd,
  I2ur0oeqg495j8,
  Ibddqkipr41dmk,
  Iep27ialq4a7o7,
  Iasu5jvoqr43mv,
  I4q4crqi176q3k,
  I5qolde99acmd1,
  Id9idaj83175f9,
  Ie1semicfuv5uu,
  If25fjs9o37co1,
  I70sc1pdo8vtos,
  I60p8l86a8cm59,
  I3m3sk2lgcabvp,
  I5pf572duh4oeg,
  I4mol6k10mv0io,
  Iec90vukseit9e,
  I7j4m7a3pkvsf4,
  Ic2n50kpnu5mae,
  Ie2vmgag6qiue4,
  I1kpuet4lkcdpf,
  I5tr1gp2t9i6oh,
  I7ls1r4u61csif,
  I3gjgtso69eopr,
  I37454vatvmm1l,
  Iblau1qa7u7fet,
  I1ti389kf8t6oi,
  If4nnre373amul,
  I55kbor0ocqk6h,
  Idsj9cg7j96kpc,
  Ido4u9drncfaml,
  Ie8c7ctks8ur2p,
  I6c6fpqmnqijqd,
  I6mik29s5073td,
  I2m0sqmb75cnpb,
  I49agc5b62mehu,
  Iatq9jda4hq6pg,
  I2g87evcjlgmqi,
  I1l21nt7d25tem,
  Ic0he9tlf9ll0u,
  Id2aanom2jncf1,
  Icdu1nb48l753j,
  I618m2uag0aopg,
  Ic8i89mfkmn3n7,
  Id2bej717ckub0,
  I545vo2e86o5i4,
  I3i09nus3ku37s,
  I2e447aa6a0imh,
  I82n7gg49bvucn,
  I58qkru548f7dl,
  Ibs22tt76qp5bi,
  I37r4bdai8o9mp,
  Idn2ghub1o4i40,
  I48u78djt89dod,
  Ib85m5kfbepu2t,
  Idaml5bdhsfcsl,
  Ieec0cu336gteb,
  I815d5k4ij85nv,
  Ifi98fgi9o46v7,
  Ic0oj9tok33uap,
  I3tdutpfjuk32j,
  I1esdujrkdacpb,
  I9g1d820jf9m2s,
  I8ve4g3egaln6a,
  I99vdr7gapai98,
  If4hvqaeoqq5us,
  Iaiqv5prlisjkg,
  I2aatv5i0cb96a,
  Ib9msr5sr8t3dn,
  I3le5tr7ugg6l2,
  I3iun9sig164po,
  I2uqmls7kcdnii,
  Idg69klialbkb8,
  I13jboebjcbglr,
  I30pg328m00nr3,
  I381dkhrurdhrs,
  Ic8hi3qr11vngc,
  Ibjdlecumfu7q7,
  Ia9ems1kg7laoc,
  I92fq0fa45vi3,
  Id01dpp0dn2cj0,
  I6nu8k62ck9o8o,
  I6s1nbislhk619,
  I218fa3heih67o,
  I1tf93k54ltg1v,
  I6ove5at7hfiur,
  I9c0urppp07b8b,
  I1a3ecmnlnvr59,
  BagsListListListError,
  Ie2db4l6126rkt,
  I3he5stuuhiokq,
  Iaqet9jc3ihboe,
  Ic952bubvq4k7d,
  I2v50gu3s1aqk6,
  Iabpgqcjikia83,
  I6hjpshamknalo,
  If7uv525tdvv7a,
  Itom7fk49o0c9,
  I2an1fs2eiebjp,
  TransactionValidityTransactionSource,
  Iajbob6uln5jct,
  I5985kfq7sspta,
  I4jmodim0td97u,
  OccupiedCoreAssumption,
  I9kavsa730sjfr,
  Ifn3gc8nc1jruq,
  Ic1d4u2opv3fst,
  Ic5plng3kq7oc8,
  Iajdik7eaq7pn0,
  I2pf0b05mc7sdr,
  I7n1him6iq79fv,
  Ialuks4a6iupcs,
  I36e6rra3ikq65,
  Idv6tqqnmb3i1j,
  Iekan13fn586c2,
  Idrp5a1qbbi2au,
  I943rhn463avqr,
  Iacuu7pfj40eo5,
  Iavuvfkop6318c,
  I3cs5lehnlql7v,
  Ifogo2hpqpe6b4,
  Ifiofttj73fsk1,
  I25plekc1moieu,
  I3eao7ea0kppv8,
  I7rj2bnb76oko1,
  I4o356o7eq06ms,
  I46e127tr8ma2h,
  I38ee9is0n4jn9,
  Ie88mmnuvmuvp5,
  I9puqgoda8ofk4,
  Iems84l8lk2v0c,
  I1r5ke30ueqo0r,
  I68ii5ik8avr9o,
  Icerf8h8pdu8ss,
  I6spmpef2c7svf,
  Iei2mvq0mjvt81,
  Iaknq33hc05bq4,
  I1p1369d52j8jd,
  DotXcmVersionedXcm,
  Ic0c3req3mlc1l,
  DotXcmVersionedAssetId,
  I7ocn4njqde3v5,
  DotXcmVersionedLocation,
  I5rlt6h8ph553n,
  I575vh6g119dum,
  I3q0jpjpeplml8,
  Ib7gh0ou2d5j8s,
  Ieh6nis3hdbtgi,
  Ie9sr1iqcg3cgm,
  I1mqgk2tmnn9i2,
  I6lr8sctk0bi4e,
  I406br9o9nfug0,
} from './common-types';
type AnonymousEnum<T extends {}> = T & {
  __anonymous: true;
};
type MyTuple<T> = [T, ...T[]];
type SeparateUndefined<T> = undefined extends T ? undefined | Exclude<T, undefined> : T;
type Anonymize<T> = SeparateUndefined<
  T extends FixedSizeBinary<infer L>
    ? number extends L
      ? Binary
      : FixedSizeBinary<L>
    : T extends
          | string
          | number
          | bigint
          | boolean
          | void
          | undefined
          | null
          | symbol
          | Uint8Array
          | Enum<any>
      ? T
      : T extends AnonymousEnum<infer V>
        ? Enum<V>
        : T extends MyTuple<any>
          ? {
              [K in keyof T]: T[K];
            }
          : T extends []
            ? []
            : T extends FixedSizeArray<infer L, infer T>
              ? number extends L
                ? Array<T>
                : FixedSizeArray<L, T>
              : {
                  [K in keyof T & string]: T[K];
                }
>;
type IStorage = {
  System: {
    /**
     * The full account information for a particular account ID.
     */
    Account: StorageDescriptor<[Key: SS58String], Anonymize<I5sesotjlssv2d>, false, never>;
    /**
     * Total extrinsics count for the current block.
     */
    ExtrinsicCount: StorageDescriptor<[], number, true, never>;
    /**
     * Whether all inherents have been applied.
     */
    InherentsApplied: StorageDescriptor<[], boolean, false, never>;
    /**
     * The current weight for the block.
     */
    BlockWeight: StorageDescriptor<[], Anonymize<Iffmde3ekjedi9>, false, never>;
    /**
     * Total length (in bytes) for all extrinsics put together, for the current block.
     */
    AllExtrinsicsLen: StorageDescriptor<[], number, true, never>;
    /**
     * Map of block numbers to block hashes.
     */
    BlockHash: StorageDescriptor<[Key: number], FixedSizeBinary<32>, false, never>;
    /**
     * Extrinsics data for the current block (maps an extrinsic's index to its data).
     */
    ExtrinsicData: StorageDescriptor<[Key: number], Binary, false, never>;
    /**
     * The current block number being processed. Set by `execute_block`.
     */
    Number: StorageDescriptor<[], number, false, never>;
    /**
     * Hash of the previous block.
     */
    ParentHash: StorageDescriptor<[], FixedSizeBinary<32>, false, never>;
    /**
     * Digest of the current block, also part of the block header.
     */
    Digest: StorageDescriptor<[], Anonymize<I4mddgoa69c0a2>, false, never>;
    /**
     * Events deposited for the current block.
     *
     * NOTE: The item is unbound and should therefore never be read on chain.
     * It could otherwise inflate the PoV size of a block.
     *
     * Events have a large in-memory size. Box the events to not go out-of-memory
     * just in case someone still reads them from within the runtime.
     */
    Events: StorageDescriptor<[], Anonymize<I1gnb9aeieaesd>, false, never>;
    /**
     * The number of events in the `Events<T>` list.
     */
    EventCount: StorageDescriptor<[], number, false, never>;
    /**
     * Mapping between a topic (represented by T::Hash) and a vector of indexes
     * of events in the `<Events<T>>` list.
     *
     * All topic vectors have deterministic storage locations depending on the topic. This
     * allows light-clients to leverage the changes trie storage tracking mechanism and
     * in case of changes fetch the list of events of interest.
     *
     * The value has the type `(BlockNumberFor<T>, EventIndex)` because if we used only just
     * the `EventIndex` then in case if the topic has the same contents on the next block
     * no notification will be triggered thus the event might be lost.
     */
    EventTopics: StorageDescriptor<
      [Key: FixedSizeBinary<32>],
      Anonymize<I95g6i7ilua7lq>,
      false,
      never
    >;
    /**
     * Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened.
     */
    LastRuntimeUpgrade: StorageDescriptor<[], Anonymize<Ieniouoqkq4icf>, true, never>;
    /**
     * True if we have upgraded so that `type RefCount` is `u32`. False (default) if not.
     */
    UpgradedToU32RefCount: StorageDescriptor<[], boolean, false, never>;
    /**
     * True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
     * (default) if not.
     */
    UpgradedToTripleRefCount: StorageDescriptor<[], boolean, false, never>;
    /**
     * The execution phase of the block.
     */
    ExecutionPhase: StorageDescriptor<[], Phase, true, never>;
    /**
     * `Some` if a code upgrade has been authorized.
     */
    AuthorizedUpgrade: StorageDescriptor<[], Anonymize<Ibgl04rn6nbfm6>, true, never>;
  };
  Babe: {
    /**
     * Current epoch index.
     */
    EpochIndex: StorageDescriptor<[], bigint, false, never>;
    /**
     * Current epoch authorities.
     */
    Authorities: StorageDescriptor<[], Anonymize<I3geksg000c171>, false, never>;
    /**
     * The slot at which the first epoch actually started. This is 0
     * until the first block of the chain.
     */
    GenesisSlot: StorageDescriptor<[], bigint, false, never>;
    /**
     * Current slot number.
     */
    CurrentSlot: StorageDescriptor<[], bigint, false, never>;
    /**
     * The epoch randomness for the *current* epoch.
     *
     * # Security
     *
     * This MUST NOT be used for gambling, as it can be influenced by a
     * malicious validator in the short term. It MAY be used in many
     * cryptographic protocols, however, so long as one remembers that this
     * (like everything else on-chain) it is public. For example, it can be
     * used where a number is needed that cannot have been chosen by an
     * adversary, for purposes such as public-coin zero-knowledge proofs.
     */
    Randomness: StorageDescriptor<[], FixedSizeBinary<32>, false, never>;
    /**
     * Pending epoch configuration change that will be applied when the next epoch is enacted.
     */
    PendingEpochConfigChange: StorageDescriptor<[], BabeDigestsNextConfigDescriptor, true, never>;
    /**
     * Next epoch randomness.
     */
    NextRandomness: StorageDescriptor<[], FixedSizeBinary<32>, false, never>;
    /**
     * Next epoch authorities.
     */
    NextAuthorities: StorageDescriptor<[], Anonymize<I3geksg000c171>, false, never>;
    /**
     * Randomness under construction.
     *
     * We make a trade-off between storage accesses and list length.
     * We store the under-construction randomness in segments of up to
     * `UNDER_CONSTRUCTION_SEGMENT_LENGTH`.
     *
     * Once a segment reaches this length, we begin the next one.
     * We reset all segments and return to `0` at the beginning of every
     * epoch.
     */
    SegmentIndex: StorageDescriptor<[], number, false, never>;
    /**
     * TWOX-NOTE: `SegmentIndex` is an increasing integer, so this is okay.
     */
    UnderConstruction: StorageDescriptor<[Key: number], Anonymize<Ic5m5lp1oioo8r>, false, never>;
    /**
     * Temporary value (cleared at block finalization) which is `Some`
     * if per-block initialization has already been called for current block.
     */
    Initialized: StorageDescriptor<[], Anonymize<Idq7or56ds2f13>, true, never>;
    /**
     * This field should always be populated during block processing unless
     * secondary plain slots are enabled (which don't contain a VRF output).
     *
     * It is set in `on_finalize`, before it will contain the value from the last block.
     */
    AuthorVrfRandomness: StorageDescriptor<[], Anonymize<I4s6vifaf8k998>, false, never>;
    /**
     * The block numbers when the last and current epoch have started, respectively `N-1` and
     * `N`.
     * NOTE: We track this is in order to annotate the block number when a given pool of
     * entropy was fixed (i.e. it was known to chain observers). Since epochs are defined in
     * slots, which may be skipped, the block numbers may not line up with the slot numbers.
     */
    EpochStart: StorageDescriptor<[], Anonymize<I9jd27rnpm8ttv>, false, never>;
    /**
     * How late the current block is compared to its parent.
     *
     * This entry is populated as part of block execution and is cleaned up
     * on block finalization. Querying this storage entry outside of block
     * execution context should always yield zero.
     */
    Lateness: StorageDescriptor<[], number, false, never>;
    /**
     * The configuration for the current epoch. Should never be `None` as it is initialized in
     * genesis.
     */
    EpochConfig: StorageDescriptor<[], Anonymize<I8jnd4d8ip6djo>, true, never>;
    /**
     * The configuration for the next epoch, `None` if the config will not change
     * (you can fallback to `EpochConfig` instead in that case).
     */
    NextEpochConfig: StorageDescriptor<[], Anonymize<I8jnd4d8ip6djo>, true, never>;
    /**
     * A list of the last 100 skipped epochs and the corresponding session index
     * when the epoch was skipped.
     *
     * This is only used for validating equivocation proofs. An equivocation proof
     * must contains a key-ownership proof for a given session, therefore we need a
     * way to tie together sessions and epoch indices, i.e. we need to validate that
     * a validator was the owner of a given key on a given session, and what the
     * active epoch index was during that session.
     */
    SkippedEpochs: StorageDescriptor<[], Anonymize<Ifip05kcrl65am>, false, never>;
  };
  Timestamp: {
    /**
     * The current time for the current block.
     */
    Now: StorageDescriptor<[], bigint, false, never>;
    /**
     * Whether the timestamp has been updated in this block.
     *
     * This value is updated to `true` upon successful submission of a timestamp by a node.
     * It is then checked at the end of each block execution in the `on_finalize` hook.
     */
    DidUpdate: StorageDescriptor<[], boolean, false, never>;
  };
  Indices: {
    /**
     * The lookup from index to account.
     */
    Accounts: StorageDescriptor<[Key: number], Anonymize<Iff9heri56m1mb>, true, never>;
  };
  Balances: {
    /**
     * The total units issued in the system.
     */
    TotalIssuance: StorageDescriptor<[], bigint, false, never>;
    /**
     * The total units of outstanding deactivated balance in the system.
     */
    InactiveIssuance: StorageDescriptor<[], bigint, false, never>;
    /**
     * The Balances pallet example of storing the balance of an account.
     *
     * # Example
     *
     * ```nocompile
     * impl pallet_balances::Config for Runtime {
     * type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
     * }
     * ```
     *
     * You can also store the balance of an account in the `System` pallet.
     *
     * # Example
     *
     * ```nocompile
     * impl pallet_balances::Config for Runtime {
     * type AccountStore = System
     * }
     * ```
     *
     * But this comes with tradeoffs, storing account balances in the system pallet stores
     * `frame_system` data alongside the account data contrary to storing account balances in the
     * `Balances` pallet, which uses a `StorageMap` to store balances data only.
     * NOTE: This is only used in the case that this pallet is used to store balances.
     */
    Account: StorageDescriptor<[Key: SS58String], Anonymize<I1q8tnt1cluu5j>, false, never>;
    /**
     * Any liquidity locks on some account balances.
     * NOTE: Should only be accessed when setting, changing and freeing a lock.
     *
     * Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    Locks: StorageDescriptor<[Key: SS58String], Anonymize<I8ds64oj6581v0>, false, never>;
    /**
     * Named reserves on some account balances.
     *
     * Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    Reserves: StorageDescriptor<[Key: SS58String], Anonymize<Ia7pdug7cdsg8g>, false, never>;
    /**
     * Holds on account balances.
     */
    Holds: StorageDescriptor<[Key: SS58String], Anonymize<Ib6k3oakd0jfsr>, false, never>;
    /**
     * Freeze locks on account balances.
     */
    Freezes: StorageDescriptor<[Key: SS58String], Anonymize<I2l1ctuihi2mfd>, false, never>;
  };
  TransactionPayment: {
    /**
        
         */
    NextFeeMultiplier: StorageDescriptor<[], bigint, false, never>;
    /**
        
         */
    StorageVersion: StorageDescriptor<[], TransactionPaymentReleases, false, never>;
  };
  Authorship: {
    /**
     * Author of current block.
     */
    Author: StorageDescriptor<[], SS58String, true, never>;
  };
  Staking: {
    /**
     * The ideal number of active validators.
     */
    ValidatorCount: StorageDescriptor<[], number, false, never>;
    /**
     * Minimum number of staking participants before emergency conditions are imposed.
     */
    MinimumValidatorCount: StorageDescriptor<[], number, false, never>;
    /**
     * Any validators that may never be slashed or forcibly kicked. It's a Vec since they're
     * easy to initialize and the performance hit is minimal (we expect no more than four
     * invulnerables) and restricted to testnets.
     */
    Invulnerables: StorageDescriptor<[], Anonymize<Ia2lhg7l2hilo3>, false, never>;
    /**
     * Map from all locked "stash" accounts to the controller account.
     *
     * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
     */
    Bonded: StorageDescriptor<[Key: SS58String], SS58String, true, never>;
    /**
     * The minimum active bond to become and maintain the role of a nominator.
     */
    MinNominatorBond: StorageDescriptor<[], bigint, false, never>;
    /**
     * The minimum active bond to become and maintain the role of a validator.
     */
    MinValidatorBond: StorageDescriptor<[], bigint, false, never>;
    /**
     * The minimum active nominator stake of the last successful election.
     */
    MinimumActiveStake: StorageDescriptor<[], bigint, false, never>;
    /**
     * The minimum amount of commission that validators can set.
     *
     * If set to `0`, no limit exists.
     */
    MinCommission: StorageDescriptor<[], number, false, never>;
    /**
     * Map from all (unlocked) "controller" accounts to the info regarding the staking.
     *
     * Note: All the reads and mutations to this storage *MUST* be done through the methods exposed
     * by [`StakingLedger`] to ensure data and lock consistency.
     */
    Ledger: StorageDescriptor<[Key: SS58String], Anonymize<Ic12aht5vh2sen>, true, never>;
    /**
     * Where the reward payment should be made. Keyed by stash.
     *
     * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
     */
    Payee: StorageDescriptor<[Key: SS58String], StakingRewardDestination, true, never>;
    /**
     * The map from (wannabe) validator stash key to the preferences of that validator.
     *
     * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
     */
    Validators: StorageDescriptor<[Key: SS58String], Anonymize<I9o7ssi9vmhmgr>, false, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForValidators: StorageDescriptor<[], number, false, never>;
    /**
     * The maximum validator count before we stop allowing new validators to join.
     *
     * When this value is not set, no limits are enforced.
     */
    MaxValidatorsCount: StorageDescriptor<[], number, true, never>;
    /**
     * The map from nominator stash key to their nomination preferences, namely the validators that
     * they wish to support.
     *
     * Note that the keys of this storage map might become non-decodable in case the
     * account's [`NominationsQuota::MaxNominations`] configuration is decreased.
     * In this rare case, these nominators
     * are still existent in storage, their key is correct and retrievable (i.e. `contains_key`
     * indicates that they exist), but their value cannot be decoded. Therefore, the non-decodable
     * nominators will effectively not-exist, until they re-submit their preferences such that it
     * is within the bounds of the newly set `Config::MaxNominations`.
     *
     * This implies that `::iter_keys().count()` and `::iter().count()` might return different
     * values for this map. Moreover, the main `::count()` is aligned with the former, namely the
     * number of keys that exist.
     *
     * Lastly, if any of the nominators become non-decodable, they can be chilled immediately via
     * [`Call::chill_other`] dispatchable by anyone.
     *
     * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
     */
    Nominators: StorageDescriptor<[Key: SS58String], Anonymize<Ic3m9d6tdl6gi2>, true, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForNominators: StorageDescriptor<[], number, false, never>;
    /**
     * Stakers whose funds are managed by other pallets.
     *
     * This pallet does not apply any locks on them, therefore they are only virtually bonded. They
     * are expected to be keyless accounts and hence should not be allowed to mutate their ledger
     * directly via this pallet. Instead, these accounts are managed by other pallets and accessed
     * via low level apis. We keep track of them to do minimal integrity checks.
     */
    VirtualStakers: StorageDescriptor<[Key: SS58String], null, true, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForVirtualStakers: StorageDescriptor<[], number, false, never>;
    /**
     * The maximum nominator count before we stop allowing new validators to join.
     *
     * When this value is not set, no limits are enforced.
     */
    MaxNominatorsCount: StorageDescriptor<[], number, true, never>;
    /**
     * The current era index.
     *
     * This is the latest planned era, depending on how the Session pallet queues the validator
     * set, it might be active or not.
     */
    CurrentEra: StorageDescriptor<[], number, true, never>;
    /**
     * The active era information, it holds index and start.
     *
     * The active era is the era being currently rewarded. Validator set of this era must be
     * equal to [`SessionInterface::validators`].
     */
    ActiveEra: StorageDescriptor<[], Anonymize<Ib3j7gb0jgs38u>, true, never>;
    /**
     * The session index at which the era start for the last [`Config::HistoryDepth`] eras.
     *
     * Note: This tracks the starting session (i.e. session index when era start being active)
     * for the eras in `[CurrentEra - HISTORY_DEPTH, CurrentEra]`.
     */
    ErasStartSessionIndex: StorageDescriptor<[Key: number], number, true, never>;
    /**
     * Exposure of validator at era.
     *
     * This is keyed first by the era index to allow bulk deletion and then the stash account.
     *
     * Is it removed after [`Config::HistoryDepth`] eras.
     * If stakers hasn't been set or has been removed then empty exposure is returned.
     *
     * Note: Deprecated since v14. Use `EraInfo` instead to work with exposures.
     */
    ErasStakers: StorageDescriptor<
      Anonymize<I7svnfko10tq2e>,
      Anonymize<Ifekshcrgkl12g>,
      false,
      never
    >;
    /**
     * Summary of validator exposure at a given era.
     *
     * This contains the total stake in support of the validator and their own stake. In addition,
     * it can also be used to get the number of nominators backing this validator and the number of
     * exposure pages they are divided into. The page count is useful to determine the number of
     * pages of rewards that needs to be claimed.
     *
     * This is keyed first by the era index to allow bulk deletion and then the stash account.
     * Should only be accessed through `EraInfo`.
     *
     * Is it removed after [`Config::HistoryDepth`] eras.
     * If stakers hasn't been set or has been removed then empty overview is returned.
     */
    ErasStakersOverview: StorageDescriptor<
      Anonymize<I7svnfko10tq2e>,
      Anonymize<I6flrronqs3l6n>,
      true,
      never
    >;
    /**
     * Clipped Exposure of validator at era.
     *
     * Note: This is deprecated, should be used as read-only and will be removed in the future.
     * New `Exposure`s are stored in a paged manner in `ErasStakersPaged` instead.
     *
     * This is similar to [`ErasStakers`] but number of nominators exposed is reduced to the
     * `T::MaxExposurePageSize` biggest stakers.
     * (Note: the field `total` and `own` of the exposure remains unchanged).
     * This is used to limit the i/o cost for the nominator payout.
     *
     * This is keyed fist by the era index to allow bulk deletion and then the stash account.
     *
     * It is removed after [`Config::HistoryDepth`] eras.
     * If stakers hasn't been set or has been removed then empty exposure is returned.
     *
     * Note: Deprecated since v14. Use `EraInfo` instead to work with exposures.
     */
    ErasStakersClipped: StorageDescriptor<
      Anonymize<I7svnfko10tq2e>,
      Anonymize<Ifekshcrgkl12g>,
      false,
      never
    >;
    /**
     * Paginated exposure of a validator at given era.
     *
     * This is keyed first by the era index to allow bulk deletion, then stash account and finally
     * the page. Should only be accessed through `EraInfo`.
     *
     * This is cleared after [`Config::HistoryDepth`] eras.
     */
    ErasStakersPaged: StorageDescriptor<
      Anonymize<Ia8896dq44k9m4>,
      Anonymize<I97fulj5h3ik95>,
      true,
      never
    >;
    /**
     * History of claimed paged rewards by era and validator.
     *
     * This is keyed by era and validator stash which maps to the set of page indexes which have
     * been claimed.
     *
     * It is removed after [`Config::HistoryDepth`] eras.
     */
    ClaimedRewards: StorageDescriptor<
      Anonymize<I7svnfko10tq2e>,
      Anonymize<Icgljjb6j82uhn>,
      false,
      never
    >;
    /**
     * Similar to `ErasStakers`, this holds the preferences of validators.
     *
     * This is keyed first by the era index to allow bulk deletion and then the stash account.
     *
     * Is it removed after [`Config::HistoryDepth`] eras.
     */
    ErasValidatorPrefs: StorageDescriptor<
      Anonymize<I7svnfko10tq2e>,
      Anonymize<I9o7ssi9vmhmgr>,
      false,
      never
    >;
    /**
     * The total validator era payout for the last [`Config::HistoryDepth`] eras.
     *
     * Eras that haven't finished yet or has been removed doesn't have reward.
     */
    ErasValidatorReward: StorageDescriptor<[Key: number], bigint, true, never>;
    /**
     * Rewards for the last [`Config::HistoryDepth`] eras.
     * If reward hasn't been set or has been removed then 0 reward is returned.
     */
    ErasRewardPoints: StorageDescriptor<[Key: number], Anonymize<Iff9p3c7k6pfoi>, false, never>;
    /**
     * The total amount staked for the last [`Config::HistoryDepth`] eras.
     * If total hasn't been set or has been removed then 0 stake is returned.
     */
    ErasTotalStake: StorageDescriptor<[Key: number], bigint, false, never>;
    /**
     * Mode of era forcing.
     */
    ForceEra: StorageDescriptor<[], StakingForcing, false, never>;
    /**
     * Maximum staked rewards, i.e. the percentage of the era inflation that
     * is used for stake rewards.
     * See [Era payout](./index.html#era-payout).
     */
    MaxStakedRewards: StorageDescriptor<[], number, true, never>;
    /**
     * The percentage of the slash that is distributed to reporters.
     *
     * The rest of the slashed value is handled by the `Slash`.
     */
    SlashRewardFraction: StorageDescriptor<[], number, false, never>;
    /**
     * The amount of currency given to reporters of a slash event which was
     * canceled by extraordinary circumstances (e.g. governance).
     */
    CanceledSlashPayout: StorageDescriptor<[], bigint, false, never>;
    /**
     * All unapplied slashes that are queued for later.
     */
    UnappliedSlashes: StorageDescriptor<[Key: number], Anonymize<Iafq6t4rgheait>, false, never>;
    /**
     * A mapping from still-bonded eras to the first session index of that era.
     *
     * Must contains information for eras for the range:
     * `[active_era - bounding_duration; active_era]`
     */
    BondedEras: StorageDescriptor<[], Anonymize<I95g6i7ilua7lq>, false, never>;
    /**
     * All slashing events on validators, mapped by era to the highest slash proportion
     * and slash value of the era.
     */
    ValidatorSlashInEra: StorageDescriptor<
      Anonymize<I7svnfko10tq2e>,
      Anonymize<I4ojmnsk1dchql>,
      true,
      never
    >;
    /**
     * All slashing events on nominators, mapped by era to the highest slash value of the era.
     */
    NominatorSlashInEra: StorageDescriptor<Anonymize<I7svnfko10tq2e>, bigint, true, never>;
    /**
     * Slashing spans for stash accounts.
     */
    SlashingSpans: StorageDescriptor<[Key: SS58String], Anonymize<Iinkhfdlka9ch>, true, never>;
    /**
     * Records information about the maximum slash of a stash within a slashing span,
     * as well as how much reward has been paid out.
     */
    SpanSlash: StorageDescriptor<
      [Key: Anonymize<I6ouflveob4eli>],
      Anonymize<I2kj4j6mp68hf8>,
      false,
      never
    >;
    /**
     * The last planned session scheduled by the session pallet.
     *
     * This is basically in sync with the call to [`pallet_session::SessionManager::new_session`].
     */
    CurrentPlannedSession: StorageDescriptor<[], number, false, never>;
    /**
     * Indices of validators that have offended in the active era. The offenders are disabled for a
     * whole era. For this reason they are kept here - only staking pallet knows about eras. The
     * implementor of [`DisablingStrategy`] defines if a validator should be disabled which
     * implicitly means that the implementor also controls the max number of disabled validators.
     *
     * The vec is always kept sorted so that we can find whether a given validator has previously
     * offended using binary search.
     */
    DisabledValidators: StorageDescriptor<[], Anonymize<Icgljjb6j82uhn>, false, never>;
    /**
     * The threshold for when users can start calling `chill_other` for other validators /
     * nominators. The threshold is compared to the actual number of validators / nominators
     * (`CountFor*`) in the system compared to the configured max (`Max*Count`).
     */
    ChillThreshold: StorageDescriptor<[], number, true, never>;
  };
  Offences: {
    /**
     * The primary structure that holds all offence records keyed by report identifiers.
     */
    Reports: StorageDescriptor<[Key: FixedSizeBinary<32>], Anonymize<I2bqvqrg0sbrdj>, true, never>;
    /**
     * A vector of reports of the same kind that happened at the same time slot.
     */
    ConcurrentReportsIndex: StorageDescriptor<
      Anonymize<I23nq3fsgtejt>,
      Anonymize<Ic5m5lp1oioo8r>,
      false,
      never
    >;
  };
  Historical: {
    /**
     * Mapping from historical session indices to session-data root hash and validator count.
     */
    HistoricalSessions: StorageDescriptor<[Key: number], Anonymize<I4pact7n2e9a0i>, true, never>;
    /**
     * The range of historical sessions we store. [first, last)
     */
    StoredRange: StorageDescriptor<[], Anonymize<I9jd27rnpm8ttv>, true, never>;
  };
  Session: {
    /**
     * The current set of validators.
     */
    Validators: StorageDescriptor<[], Anonymize<Ia2lhg7l2hilo3>, false, never>;
    /**
     * Current index of the session.
     */
    CurrentIndex: StorageDescriptor<[], number, false, never>;
    /**
     * True if the underlying economic identities or weighting behind the validators
     * has changed in the queued validator set.
     */
    QueuedChanged: StorageDescriptor<[], boolean, false, never>;
    /**
     * The queued keys for the next session. When the next session begins, these keys
     * will be used to determine the validator's session keys.
     */
    QueuedKeys: StorageDescriptor<[], Anonymize<Idt624nf41g34e>, false, never>;
    /**
     * Indices of disabled validators.
     *
     * The vec is always kept sorted so that we can find whether a given validator is
     * disabled using binary search. It gets cleared when `on_session_ending` returns
     * a new set of identities.
     */
    DisabledValidators: StorageDescriptor<[], Anonymize<Icgljjb6j82uhn>, false, never>;
    /**
     * The next session keys for a validator.
     */
    NextKeys: StorageDescriptor<[Key: SS58String], Anonymize<I9kr8cseidc66h>, true, never>;
    /**
     * The owner of a key. The key is the `KeyTypeId` + the encoded key.
     */
    KeyOwner: StorageDescriptor<[Key: Anonymize<I82jm9g7pufuel>], SS58String, true, never>;
  };
  Grandpa: {
    /**
     * State of the current authority set.
     */
    State: StorageDescriptor<[], GrandpaStoredState, false, never>;
    /**
     * Pending change: (signaled at, scheduled change).
     */
    PendingChange: StorageDescriptor<[], Anonymize<I7pe2me3i3vtn9>, true, never>;
    /**
     * next block number where we can force a change.
     */
    NextForced: StorageDescriptor<[], number, true, never>;
    /**
     * `true` if we are currently stalled.
     */
    Stalled: StorageDescriptor<[], Anonymize<I9jd27rnpm8ttv>, true, never>;
    /**
     * The number of changes (both in terms of keys and underlying economic responsibilities)
     * in the "set" of Grandpa validators from genesis.
     */
    CurrentSetId: StorageDescriptor<[], bigint, false, never>;
    /**
     * A mapping from grandpa set ID to the index of the *most recent* session for which its
     * members were responsible.
     *
     * This is only used for validating equivocation proofs. An equivocation proof must
     * contains a key-ownership proof for a given session, therefore we need a way to tie
     * together sessions and GRANDPA set ids, i.e. we need to validate that a validator
     * was the owner of a given key on a given session, and what the active set ID was
     * during that session.
     *
     * TWOX-NOTE: `SetId` is not under user control.
     */
    SetIdSession: StorageDescriptor<[Key: bigint], number, true, never>;
    /**
     * The current list of authorities.
     */
    Authorities: StorageDescriptor<[], Anonymize<I3geksg000c171>, false, never>;
  };
  AuthorityDiscovery: {
    /**
     * Keys of the current authority set.
     */
    Keys: StorageDescriptor<[], Anonymize<Ic5m5lp1oioo8r>, false, never>;
    /**
     * Keys of the next authority set.
     */
    NextKeys: StorageDescriptor<[], Anonymize<Ic5m5lp1oioo8r>, false, never>;
  };
  Treasury: {
    /**
     * Number of proposals that have been made.
     */
    ProposalCount: StorageDescriptor<[], number, false, never>;
    /**
     * Proposals that have been made.
     */
    Proposals: StorageDescriptor<[Key: number], Anonymize<Iegmj7n48sc3am>, true, never>;
    /**
     * The amount which has been reported as inactive to Currency.
     */
    Deactivated: StorageDescriptor<[], bigint, false, never>;
    /**
     * Proposal indices that have been approved but not yet awarded.
     */
    Approvals: StorageDescriptor<[], Anonymize<Icgljjb6j82uhn>, false, never>;
    /**
     * The count of spends that have been made.
     */
    SpendCount: StorageDescriptor<[], number, false, never>;
    /**
     * Spends that have been approved and being processed.
     */
    Spends: StorageDescriptor<[Key: number], Anonymize<I5v9a2mdqq4t8u>, true, never>;
  };
  ConvictionVoting: {
    /**
     * All voting for a particular voter in a particular voting class. We store the balance for the
     * number of votes that we have recorded.
     */
    VotingFor: StorageDescriptor<
      Anonymize<I6ouflveob4eli>,
      ConvictionVotingVoteVoting,
      false,
      never
    >;
    /**
     * The voting classes which have a non-zero lock requirement and the lock amounts which they
     * require. The actual amount locked on behalf of this pallet should always be the maximum of
     * this list.
     */
    ClassLocksFor: StorageDescriptor<[Key: SS58String], Anonymize<If9jidduiuq7vv>, false, never>;
  };
  Referenda: {
    /**
     * The next free referendum index, aka the number of referenda started so far.
     */
    ReferendumCount: StorageDescriptor<[], number, false, never>;
    /**
     * Information concerning any given referendum.
     */
    ReferendumInfoFor: StorageDescriptor<[Key: number], Anonymize<I85t6l9pssiov4>, true, never>;
    /**
     * The sorted list of referenda ready to be decided but not yet being decided, ordered by
     * conviction-weighted approvals.
     *
     * This should be empty if `DecidingCount` is less than `TrackInfo::max_deciding`.
     */
    TrackQueue: StorageDescriptor<[Key: number], Anonymize<If9jidduiuq7vv>, false, never>;
    /**
     * The number of referenda being decided currently.
     */
    DecidingCount: StorageDescriptor<[Key: number], number, false, never>;
    /**
     * The metadata is a general information concerning the referendum.
     * The `Hash` refers to the preimage of the `Preimages` provider which can be a JSON
     * dump or IPFS hash of a JSON file.
     *
     * Consider a garbage collection for a metadata of finished referendums to `unrequest` (remove)
     * large preimages.
     */
    MetadataOf: StorageDescriptor<[Key: number], FixedSizeBinary<32>, true, never>;
  };
  FellowshipCollective: {
    /**
     * The number of members in the collective who have at least the rank according to the index
     * of the vec.
     */
    MemberCount: StorageDescriptor<[Key: number], number, false, never>;
    /**
     * The current members of the collective.
     */
    Members: StorageDescriptor<[Key: SS58String], number, true, never>;
    /**
     * The index of each ranks's member into the group of members who have at least that rank.
     */
    IdToIndex: StorageDescriptor<Anonymize<I7svnfko10tq2e>, number, true, never>;
    /**
     * The members in the collective by index. All indices in the range `0..MemberCount` will
     * return `Some`, however a member's index is not guaranteed to remain unchanged over time.
     */
    IndexToId: StorageDescriptor<Anonymize<I5g2vv0ckl2m8b>, SS58String, true, never>;
    /**
     * Votes on a given proposal, if it is ongoing.
     */
    Voting: StorageDescriptor<Anonymize<I7svnfko10tq2e>, Anonymize<I3gg47bgkgq9tr>, true, never>;
    /**
        
         */
    VotingCleanup: StorageDescriptor<[Key: number], Binary, true, never>;
  };
  FellowshipReferenda: {
    /**
     * The next free referendum index, aka the number of referenda started so far.
     */
    ReferendumCount: StorageDescriptor<[], number, false, never>;
    /**
     * Information concerning any given referendum.
     */
    ReferendumInfoFor: StorageDescriptor<[Key: number], Anonymize<Icousgkbefm7ke>, true, never>;
    /**
     * The sorted list of referenda ready to be decided but not yet being decided, ordered by
     * conviction-weighted approvals.
     *
     * This should be empty if `DecidingCount` is less than `TrackInfo::max_deciding`.
     */
    TrackQueue: StorageDescriptor<[Key: number], Anonymize<I95g6i7ilua7lq>, false, never>;
    /**
     * The number of referenda being decided currently.
     */
    DecidingCount: StorageDescriptor<[Key: number], number, false, never>;
    /**
     * The metadata is a general information concerning the referendum.
     * The `Hash` refers to the preimage of the `Preimages` provider which can be a JSON
     * dump or IPFS hash of a JSON file.
     *
     * Consider a garbage collection for a metadata of finished referendums to `unrequest` (remove)
     * large preimages.
     */
    MetadataOf: StorageDescriptor<[Key: number], FixedSizeBinary<32>, true, never>;
  };
  Whitelist: {
    /**
        
         */
    WhitelistedCall: StorageDescriptor<[Key: FixedSizeBinary<32>], null, true, never>;
  };
  Parameters: {
    /**
     * Stored parameters.
     */
    Parameters: StorageDescriptor<
      [Key: Anonymize<I5ps9qbqlvun7q>],
      Anonymize<Iddckvbdfdasmv>,
      true,
      never
    >;
  };
  Claims: {
    /**
        
         */
    Claims: StorageDescriptor<[Key: FixedSizeBinary<20>], bigint, true, never>;
    /**
        
         */
    Total: StorageDescriptor<[], bigint, false, never>;
    /**
     * Vesting schedule for a claim.
     * First balance is the total amount that should be held for vesting.
     * Second balance is how much should be unlocked per block.
     * The block number is when the vesting should start.
     */
    Vesting: StorageDescriptor<[Key: FixedSizeBinary<20>], Anonymize<I2phecamkn3pej>, true, never>;
    /**
     * The statement kind that must be signed, if any.
     */
    Signing: StorageDescriptor<[Key: FixedSizeBinary<20>], ClaimsStatementKind, true, never>;
    /**
     * Pre-claimed Ethereum accounts, by the Account ID that they are claimed to.
     */
    Preclaims: StorageDescriptor<[Key: SS58String], FixedSizeBinary<20>, true, never>;
  };
  Society: {
    /**
     * The max number of members for the society at one time.
     */
    Parameters: StorageDescriptor<[], Anonymize<I9hkvi4k3kh916>, true, never>;
    /**
     * Amount of our account balance that is specifically for the next round's bid(s).
     */
    Pot: StorageDescriptor<[], bigint, false, never>;
    /**
     * The first member.
     */
    Founder: StorageDescriptor<[], SS58String, true, never>;
    /**
     * The most primary from the most recently approved rank 0 members in the society.
     */
    Head: StorageDescriptor<[], SS58String, true, never>;
    /**
     * A hash of the rules of this society concerning membership. Can only be set once and
     * only by the founder.
     */
    Rules: StorageDescriptor<[], FixedSizeBinary<32>, true, never>;
    /**
     * The current members and their rank. Doesn't include `SuspendedMembers`.
     */
    Members: StorageDescriptor<[Key: SS58String], Anonymize<Iam8qhv8b3jn4n>, true, never>;
    /**
     * Information regarding rank-0 payouts, past and future.
     */
    Payouts: StorageDescriptor<[Key: SS58String], Anonymize<I1659sf24o6ga8>, false, never>;
    /**
     * The number of items in `Members` currently. (Doesn't include `SuspendedMembers`.)
     */
    MemberCount: StorageDescriptor<[], number, false, never>;
    /**
     * The current items in `Members` keyed by their unique index. Keys are densely populated
     * `0..MemberCount` (does not include `MemberCount`).
     */
    MemberByIndex: StorageDescriptor<[Key: number], SS58String, true, never>;
    /**
     * The set of suspended members, with their old membership record.
     */
    SuspendedMembers: StorageDescriptor<[Key: SS58String], Anonymize<Iam8qhv8b3jn4n>, true, never>;
    /**
     * The number of rounds which have passed.
     */
    RoundCount: StorageDescriptor<[], number, false, never>;
    /**
     * The current bids, stored ordered by the value of the bid.
     */
    Bids: StorageDescriptor<[], Anonymize<Iehiasr6uoqbq>, false, never>;
    /**
        
         */
    Candidates: StorageDescriptor<[Key: SS58String], Anonymize<I8adv0j4q3uu5d>, true, never>;
    /**
     * The current skeptic.
     */
    Skeptic: StorageDescriptor<[], SS58String, true, never>;
    /**
     * Double map from Candidate -> Voter -> (Maybe) Vote.
     */
    Votes: StorageDescriptor<Anonymize<I2na29tt2afp0j>, Anonymize<I7d29ossbog0d3>, true, never>;
    /**
     * Clear-cursor for Vote, map from Candidate -> (Maybe) Cursor.
     */
    VoteClearCursor: StorageDescriptor<[Key: SS58String], Binary, true, never>;
    /**
     * At the end of the claim period, this contains the most recently approved members (along with
     * their bid and round ID) who is from the most recent round with the lowest bid. They will
     * become the new `Head`.
     */
    NextHead: StorageDescriptor<[], Anonymize<I7mgf69gvksvu2>, true, never>;
    /**
     * The number of challenge rounds there have been. Used to identify stale DefenderVotes.
     */
    ChallengeRoundCount: StorageDescriptor<[], number, false, never>;
    /**
     * The defending member currently being challenged, along with a running tally of votes.
     */
    Defending: StorageDescriptor<[], Anonymize<I3sfg6klg56vmk>, true, never>;
    /**
     * Votes for the defender, keyed by challenge round.
     */
    DefenderVotes: StorageDescriptor<
      Anonymize<I7svnfko10tq2e>,
      Anonymize<I7d29ossbog0d3>,
      true,
      never
    >;
  };
  Recovery: {
    /**
     * The set of recoverable accounts and their recovery configuration.
     */
    Recoverable: StorageDescriptor<[Key: SS58String], Anonymize<Ibprd8oi8phm62>, true, never>;
    /**
     * Active recovery attempts.
     *
     * First account is the account to be recovered, and the second account
     * is the user trying to recover the account.
     */
    ActiveRecoveries: StorageDescriptor<
      Anonymize<I2na29tt2afp0j>,
      Anonymize<Idlqqo993i780l>,
      true,
      never
    >;
    /**
     * The list of allowed proxy accounts.
     *
     * Map from the user who can access it to the recovered account.
     */
    Proxy: StorageDescriptor<[Key: SS58String], SS58String, true, never>;
  };
  Vesting: {
    /**
     * Information regarding the vesting of a given account.
     */
    Vesting: StorageDescriptor<[Key: SS58String], Anonymize<Ifble4juuml5ig>, true, never>;
    /**
     * Storage version of the pallet.
     *
     * New networks start with latest version, as determined by the genesis build.
     */
    StorageVersion: StorageDescriptor<[], Version, false, never>;
  };
  Scheduler: {
    /**
        
         */
    IncompleteSince: StorageDescriptor<[], number, true, never>;
    /**
     * Items to be executed, indexed by the block number that they should be executed on.
     */
    Agenda: StorageDescriptor<[Key: number], Anonymize<Ic836nv7r3fq4i>, false, never>;
    /**
     * Retry configurations for items to be executed, indexed by task address.
     */
    Retries: StorageDescriptor<
      [Key: Anonymize<I9jd27rnpm8ttv>],
      Anonymize<I56u24ncejr5kt>,
      true,
      never
    >;
    /**
     * Lookup from a name to the block number and index of the task.
     *
     * For v3 -> v4 the previously unbounded identities are Blake2-256 hashed to form the v4
     * identities.
     */
    Lookup: StorageDescriptor<[Key: FixedSizeBinary<32>], Anonymize<I9jd27rnpm8ttv>, true, never>;
  };
  Proxy: {
    /**
     * The set of account proxies. Maps the account which has delegated to the accounts
     * which are being delegated to, together with the amount held on deposit.
     */
    Proxies: StorageDescriptor<[Key: SS58String], Anonymize<I4pnnts4ec8rh0>, false, never>;
    /**
     * The announcements made by the proxy (key).
     */
    Announcements: StorageDescriptor<[Key: SS58String], Anonymize<I9p9lq3rej5bhc>, false, never>;
  };
  Multisig: {
    /**
     * The set of open multisig operations.
     */
    Multisigs: StorageDescriptor<Anonymize<I8uo3fpd3bcc6f>, Anonymize<Iag146hmjgqfgj>, true, never>;
  };
  Preimage: {
    /**
     * The request status of a given hash.
     */
    StatusFor: StorageDescriptor<[Key: FixedSizeBinary<32>], PreimageOldRequestStatus, true, never>;
    /**
     * The request status of a given hash.
     */
    RequestStatusFor: StorageDescriptor<
      [Key: FixedSizeBinary<32>],
      PreimageRequestStatus,
      true,
      never
    >;
    /**
        
         */
    PreimageFor: StorageDescriptor<[Key: Anonymize<I4pact7n2e9a0i>], Binary, true, never>;
  };
  Bounties: {
    /**
     * Number of bounty proposals that have been made.
     */
    BountyCount: StorageDescriptor<[], number, false, never>;
    /**
     * Bounties that have been made.
     */
    Bounties: StorageDescriptor<[Key: number], Anonymize<I8phqps8r3of7e>, true, never>;
    /**
     * The description of each bounty.
     */
    BountyDescriptions: StorageDescriptor<[Key: number], Binary, true, never>;
    /**
     * Bounty indices that have been approved but not yet funded.
     */
    BountyApprovals: StorageDescriptor<[], Anonymize<Icgljjb6j82uhn>, false, never>;
  };
  ChildBounties: {
    /**
     * Number of total child bounties.
     */
    ChildBountyCount: StorageDescriptor<[], number, false, never>;
    /**
     * Number of child bounties per parent bounty.
     * Map of parent bounty index to number of child bounties.
     */
    ParentChildBounties: StorageDescriptor<[Key: number], number, false, never>;
    /**
     * Child bounties that have been added.
     */
    ChildBounties: StorageDescriptor<
      Anonymize<I9jd27rnpm8ttv>,
      Anonymize<Ibofbvvaehln4e>,
      true,
      never
    >;
    /**
     * The description of each child-bounty.
     */
    ChildBountyDescriptions: StorageDescriptor<[Key: number], Binary, true, never>;
    /**
     * The cumulative child-bounty curator fee for each parent bounty.
     */
    ChildrenCuratorFees: StorageDescriptor<[Key: number], bigint, false, never>;
  };
  ElectionProviderMultiPhase: {
    /**
     * Internal counter for the number of rounds.
     *
     * This is useful for de-duplication of transactions submitted to the pool, and general
     * diagnostics of the pallet.
     *
     * This is merely incremented once per every time that an upstream `elect` is called.
     */
    Round: StorageDescriptor<[], number, false, never>;
    /**
     * Current phase.
     */
    CurrentPhase: StorageDescriptor<[], ElectionProviderMultiPhasePhase, false, never>;
    /**
     * Current best solution, signed or unsigned, queued to be returned upon `elect`.
     *
     * Always sorted by score.
     */
    QueuedSolution: StorageDescriptor<[], Anonymize<Ictkaqdbfabuek>, true, never>;
    /**
     * Snapshot data of the round.
     *
     * This is created at the beginning of the signed phase and cleared upon calling `elect`.
     * Note: This storage type must only be mutated through [`SnapshotWrapper`].
     */
    Snapshot: StorageDescriptor<[], Anonymize<Ia7o65280hur3p>, true, never>;
    /**
     * Desired number of targets to elect for this round.
     *
     * Only exists when [`Snapshot`] is present.
     * Note: This storage type must only be mutated through [`SnapshotWrapper`].
     */
    DesiredTargets: StorageDescriptor<[], number, true, never>;
    /**
     * The metadata of the [`RoundSnapshot`]
     *
     * Only exists when [`Snapshot`] is present.
     * Note: This storage type must only be mutated through [`SnapshotWrapper`].
     */
    SnapshotMetadata: StorageDescriptor<[], Anonymize<Iasd2iat48n080>, true, never>;
    /**
     * The next index to be assigned to an incoming signed submission.
     *
     * Every accepted submission is assigned a unique index; that index is bound to that particular
     * submission for the duration of the election. On election finalization, the next index is
     * reset to 0.
     *
     * We can't just use `SignedSubmissionIndices.len()`, because that's a bounded set; past its
     * capacity, it will simply saturate. We can't just iterate over `SignedSubmissionsMap`,
     * because iteration is slow. Instead, we store the value here.
     */
    SignedSubmissionNextIndex: StorageDescriptor<[], number, false, never>;
    /**
     * A sorted, bounded vector of `(score, block_number, index)`, where each `index` points to a
     * value in `SignedSubmissions`.
     *
     * We never need to process more than a single signed submission at a time. Signed submissions
     * can be quite large, so we're willing to pay the cost of multiple database accesses to access
     * them one at a time instead of reading and decoding all of them at once.
     */
    SignedSubmissionIndices: StorageDescriptor<[], Anonymize<Ic8d01sg6acf60>, false, never>;
    /**
     * Unchecked, signed solutions.
     *
     * Together with `SubmissionIndices`, this stores a bounded set of `SignedSubmissions` while
     * allowing us to keep only a single one in memory at a time.
     *
     * Twox note: the key of the map is an auto-incrementing index which users cannot inspect or
     * affect; we shouldn't need a cryptographically secure hasher.
     */
    SignedSubmissionsMap: StorageDescriptor<[Key: number], Anonymize<I84stt310eb6c3>, true, never>;
    /**
     * The minimum score that each 'untrusted' solution must attain in order to be considered
     * feasible.
     *
     * Can be set via `set_minimum_untrusted_score`.
     */
    MinimumUntrustedScore: StorageDescriptor<[], Anonymize<I8s6n43okuj2b1>, true, never>;
  };
  Nis: {
    /**
     * The totals of items and balances within each queue. Saves a lot of storage reads in the
     * case of sparsely packed queues.
     *
     * The vector is indexed by duration in `Period`s, offset by one, so information on the queue
     * whose duration is one `Period` would be storage `0`.
     */
    QueueTotals: StorageDescriptor<[], Anonymize<If9jidduiuq7vv>, false, never>;
    /**
     * The queues of bids. Indexed by duration (in `Period`s).
     */
    Queues: StorageDescriptor<[Key: number], Anonymize<I2cqtnj49ogo81>, false, never>;
    /**
     * Summary information over the general state.
     */
    Summary: StorageDescriptor<[], Anonymize<I7btpfdeli5ea8>, false, never>;
    /**
     * The currently outstanding receipts, indexed according to the order of creation.
     */
    Receipts: StorageDescriptor<[Key: number], Anonymize<Ic79q40j9qptgh>, true, never>;
  };
  NisCounterpartBalances: {
    /**
     * The total units issued in the system.
     */
    TotalIssuance: StorageDescriptor<[], bigint, false, never>;
    /**
     * The total units of outstanding deactivated balance in the system.
     */
    InactiveIssuance: StorageDescriptor<[], bigint, false, never>;
    /**
     * The Balances pallet example of storing the balance of an account.
     *
     * # Example
     *
     * ```nocompile
     * impl pallet_balances::Config for Runtime {
     * type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
     * }
     * ```
     *
     * You can also store the balance of an account in the `System` pallet.
     *
     * # Example
     *
     * ```nocompile
     * impl pallet_balances::Config for Runtime {
     * type AccountStore = System
     * }
     * ```
     *
     * But this comes with tradeoffs, storing account balances in the system pallet stores
     * `frame_system` data alongside the account data contrary to storing account balances in the
     * `Balances` pallet, which uses a `StorageMap` to store balances data only.
     * NOTE: This is only used in the case that this pallet is used to store balances.
     */
    Account: StorageDescriptor<[Key: SS58String], Anonymize<I1q8tnt1cluu5j>, false, never>;
    /**
     * Any liquidity locks on some account balances.
     * NOTE: Should only be accessed when setting, changing and freeing a lock.
     *
     * Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    Locks: StorageDescriptor<[Key: SS58String], Anonymize<I8ds64oj6581v0>, false, never>;
    /**
     * Named reserves on some account balances.
     *
     * Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    Reserves: StorageDescriptor<[Key: SS58String], Anonymize<Ia7pdug7cdsg8g>, false, never>;
    /**
     * Holds on account balances.
     */
    Holds: StorageDescriptor<[Key: SS58String], Anonymize<Ib6k3oakd0jfsr>, false, never>;
    /**
     * Freeze locks on account balances.
     */
    Freezes: StorageDescriptor<[Key: SS58String], Anonymize<I9bin2jc70qt6q>, false, never>;
  };
  VoterList: {
    /**
     * A single node, within some bag.
     *
     * Nodes store links forward and back within their respective bags.
     */
    ListNodes: StorageDescriptor<[Key: SS58String], Anonymize<Ic5t26f9cp3tvk>, true, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForListNodes: StorageDescriptor<[], number, false, never>;
    /**
     * A bag stored in storage.
     *
     * Stores a `Bag` struct, which stores head and tail pointers to itself.
     */
    ListBags: StorageDescriptor<[Key: bigint], Anonymize<I39k39h6vu4hbq>, true, never>;
  };
  NominationPools: {
    /**
     * The sum of funds across all pools.
     *
     * This might be lower but never higher than the sum of `total_balance` of all [`PoolMembers`]
     * because calling `pool_withdraw_unbonded` might decrease the total stake of the pool's
     * `bonded_account` without adjusting the pallet-internal `UnbondingPool`'s.
     */
    TotalValueLocked: StorageDescriptor<[], bigint, false, never>;
    /**
     * Minimum amount to bond to join a pool.
     */
    MinJoinBond: StorageDescriptor<[], bigint, false, never>;
    /**
     * Minimum bond required to create a pool.
     *
     * This is the amount that the depositor must put as their initial stake in the pool, as an
     * indication of "skin in the game".
     *
     * This is the value that will always exist in the staking ledger of the pool bonded account
     * while all other accounts leave.
     */
    MinCreateBond: StorageDescriptor<[], bigint, false, never>;
    /**
     * Maximum number of nomination pools that can exist. If `None`, then an unbounded number of
     * pools can exist.
     */
    MaxPools: StorageDescriptor<[], number, true, never>;
    /**
     * Maximum number of members that can exist in the system. If `None`, then the count
     * members are not bound on a system wide basis.
     */
    MaxPoolMembers: StorageDescriptor<[], number, true, never>;
    /**
     * Maximum number of members that may belong to pool. If `None`, then the count of
     * members is not bound on a per pool basis.
     */
    MaxPoolMembersPerPool: StorageDescriptor<[], number, true, never>;
    /**
     * The maximum commission that can be charged by a pool. Used on commission payouts to bound
     * pool commissions that are > `GlobalMaxCommission`, necessary if a future
     * `GlobalMaxCommission` is lower than some current pool commissions.
     */
    GlobalMaxCommission: StorageDescriptor<[], number, true, never>;
    /**
     * Active members.
     *
     * TWOX-NOTE: SAFE since `AccountId` is a secure hash.
     */
    PoolMembers: StorageDescriptor<[Key: SS58String], Anonymize<Idphjddn2h69vc>, true, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForPoolMembers: StorageDescriptor<[], number, false, never>;
    /**
     * Storage for bonded pools.
     */
    BondedPools: StorageDescriptor<[Key: number], Anonymize<Idhh9vuu2bderg>, true, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForBondedPools: StorageDescriptor<[], number, false, never>;
    /**
     * Reward pools. This is where there rewards for each pool accumulate. When a members payout is
     * claimed, the balance comes out of the reward pool. Keyed by the bonded pools account.
     */
    RewardPools: StorageDescriptor<[Key: number], Anonymize<If6qa32dj75gu1>, true, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForRewardPools: StorageDescriptor<[], number, false, never>;
    /**
     * Groups of unbonding pools. Each group of unbonding pools belongs to a
     * bonded pool, hence the name sub-pools. Keyed by the bonded pools account.
     */
    SubPoolsStorage: StorageDescriptor<[Key: number], Anonymize<I7oo2mprv1qd1s>, true, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForSubPoolsStorage: StorageDescriptor<[], number, false, never>;
    /**
     * Metadata for the pool.
     */
    Metadata: StorageDescriptor<[Key: number], Binary, false, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForMetadata: StorageDescriptor<[], number, false, never>;
    /**
     * Ever increasing number of all pools created so far.
     */
    LastPoolId: StorageDescriptor<[], number, false, never>;
    /**
     * A reverse lookup from the pool's account id to its id.
     *
     * This is only used for slashing and on automatic withdraw update. In all other instances, the
     * pool id is used, and the accounts are deterministically derived from it.
     */
    ReversePoolIdLookup: StorageDescriptor<[Key: SS58String], number, true, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForReversePoolIdLookup: StorageDescriptor<[], number, false, never>;
    /**
     * Map from a pool member account to their opted claim permission.
     */
    ClaimPermissions: StorageDescriptor<
      [Key: SS58String],
      NominationPoolsClaimPermission,
      false,
      never
    >;
  };
  FastUnstake: {
    /**
     * The current "head of the queue" being unstaked.
     *
     * The head in itself can be a batch of up to [`Config::BatchSize`] stakers.
     */
    Head: StorageDescriptor<[], Anonymize<I2eh80qovrl7h2>, true, never>;
    /**
     * The map of all accounts wishing to be unstaked.
     *
     * Keeps track of `AccountId` wishing to unstake and it's corresponding deposit.
     */
    Queue: StorageDescriptor<[Key: SS58String], bigint, true, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForQueue: StorageDescriptor<[], number, false, never>;
    /**
     * Number of eras to check per block.
     *
     * If set to 0, this pallet does absolutely nothing. Cannot be set to more than
     * [`Config::MaxErasToCheckPerBlock`].
     *
     * Based on the amount of weight available at [`Pallet::on_idle`], up to this many eras are
     * checked. The checking is represented by updating [`UnstakeRequest::checked`], which is
     * stored in [`Head`].
     */
    ErasToCheckPerBlock: StorageDescriptor<[], number, false, never>;
  };
  DelegatedStaking: {
    /**
     * Map of Delegators to their `Delegation`.
     *
     * Implementation note: We are not using a double map with `delegator` and `agent` account
     * as keys since we want to restrict delegators to delegate only to one account at a time.
     */
    Delegators: StorageDescriptor<[Key: SS58String], Anonymize<I542q009qbgt8k>, true, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForDelegators: StorageDescriptor<[], number, false, never>;
    /**
     * Map of `Agent` to their `Ledger`.
     */
    Agents: StorageDescriptor<[Key: SS58String], Anonymize<I4e5ujckjq61g8>, true, never>;
    /**
     * Counter for the related counted storage map
     */
    CounterForAgents: StorageDescriptor<[], number, false, never>;
  };
  Configuration: {
    /**
     * The active configuration for the current session.
     */
    ActiveConfig: StorageDescriptor<[], Anonymize<Idinvj2ldfa0k7>, false, never>;
    /**
     * Pending configuration changes.
     *
     * This is a list of configuration changes, each with a session index at which it should
     * be applied.
     *
     * The list is sorted ascending by session index. Also, this list can only contain at most
     * 2 items: for the next session and for the `scheduled_session`.
     */
    PendingConfigs: StorageDescriptor<[], Anonymize<I78k2970vpbt1t>, false, never>;
    /**
     * If this is set, then the configuration setters will bypass the consistency checks. This
     * is meant to be used only as the last resort.
     */
    BypassConsistencyCheck: StorageDescriptor<[], boolean, false, never>;
  };
  ParasShared: {
    /**
     * The current session index.
     */
    CurrentSessionIndex: StorageDescriptor<[], number, false, never>;
    /**
     * All the validators actively participating in parachain consensus.
     * Indices are into the broader validator set.
     */
    ActiveValidatorIndices: StorageDescriptor<[], Anonymize<Icgljjb6j82uhn>, false, never>;
    /**
     * The parachain attestation keys of the validators actively participating in parachain
     * consensus. This should be the same length as `ActiveValidatorIndices`.
     */
    ActiveValidatorKeys: StorageDescriptor<[], Anonymize<Ic5m5lp1oioo8r>, false, never>;
    /**
     * All allowed relay-parents.
     */
    AllowedRelayParents: StorageDescriptor<[], Anonymize<I27il479s8gsv0>, false, never>;
  };
  ParaInclusion: {
    /**
     * Candidates pending availability by `ParaId`. They form a chain starting from the latest
     * included head of the para.
     * Use a different prefix post-migration to v1, since the v0 `PendingAvailability` storage
     * would otherwise have the exact same prefix which could cause undefined behaviour when doing
     * the migration.
     */
    V1: StorageDescriptor<[Key: number], Anonymize<Id375uoldedict>, true, never>;
  };
  ParaInherent: {
    /**
     * Whether the paras inherent was included within this block.
     *
     * The `Option<()>` is effectively a `bool`, but it never hits storage in the `None` variant
     * due to the guarantees of FRAME's storage APIs.
     *
     * If this is `None` at the end of the block, we panic and render the block invalid.
     */
    Included: StorageDescriptor<[], null, true, never>;
    /**
     * Scraped on chain data for extracting resolved disputes as well as backing votes.
     */
    OnChainVotes: StorageDescriptor<[], Anonymize<Ilg2fqs6cjgs3>, true, never>;
  };
  ParaScheduler: {
    /**
     * All the validator groups. One for each core. Indices are into `ActiveValidators` - not the
     * broader set of Polkadot validators, but instead just the subset used for parachains during
     * this session.
     *
     * Bound: The number of cores is the sum of the numbers of parachains and parathread
     * multiplexers. Reasonably, 100-1000. The dominant factor is the number of validators: safe
     * upper bound at 10k.
     */
    ValidatorGroups: StorageDescriptor<[], Anonymize<Iarlj3qd8u1v13>, false, never>;
    /**
     * One entry for each availability core. The i'th parachain belongs to the i'th core, with the
     * remaining cores all being on demand parachain multiplexers.
     *
     * Bounded by the maximum of either of these two values:
     * * The number of parachains and parathread multiplexers
     * * The number of validators divided by `configuration.max_validators_per_core`.
     */
    AvailabilityCores: StorageDescriptor<[], Anonymize<I2ng2krd94ceva>, false, never>;
    /**
     * The block number where the session start occurred. Used to track how many group rotations
     * have occurred.
     *
     * Note that in the context of parachains modules the session change is signaled during
     * the block and enacted at the end of the block (at the finalization stage, to be exact).
     * Thus for all intents and purposes the effect of the session change is observed at the
     * block following the session change, block number of which we save in this storage value.
     */
    SessionStartBlock: StorageDescriptor<[], number, false, never>;
    /**
     * One entry for each availability core. The `VecDeque` represents the assignments to be
     * scheduled on that core. The value contained here will not be valid after the end of
     * a block. Runtime APIs should be used to determine scheduled cores for the upcoming block.
     */
    ClaimQueue: StorageDescriptor<[], Anonymize<Ie18mk3nmrn3nr>, false, never>;
  };
  Paras: {
    /**
     * All currently active PVF pre-checking votes.
     *
     * Invariant:
     * - There are no PVF pre-checking votes that exists in list but not in the set and vice versa.
     */
    PvfActiveVoteMap: StorageDescriptor<
      [Key: FixedSizeBinary<32>],
      Anonymize<I4vk12npmr8ll0>,
      true,
      never
    >;
    /**
     * The list of all currently active PVF votes. Auxiliary to `PvfActiveVoteMap`.
     */
    PvfActiveVoteList: StorageDescriptor<[], Anonymize<Ic5m5lp1oioo8r>, false, never>;
    /**
     * All lease holding parachains. Ordered ascending by `ParaId`. On demand parachains are not
     * included.
     *
     * Consider using the [`ParachainsCache`] type of modifying.
     */
    Parachains: StorageDescriptor<[], Anonymize<Icgljjb6j82uhn>, false, never>;
    /**
     * The current lifecycle of a all known Para IDs.
     */
    ParaLifecycles: StorageDescriptor<[Key: number], ParachainsParasParaLifecycle, true, never>;
    /**
     * The head-data of every registered para.
     */
    Heads: StorageDescriptor<[Key: number], Binary, true, never>;
    /**
     * The context (relay-chain block number) of the most recent parachain head.
     */
    MostRecentContext: StorageDescriptor<[Key: number], number, true, never>;
    /**
     * The validation code hash of every live para.
     *
     * Corresponding code can be retrieved with [`CodeByHash`].
     */
    CurrentCodeHash: StorageDescriptor<[Key: number], FixedSizeBinary<32>, true, never>;
    /**
     * Actual past code hash, indicated by the para id as well as the block number at which it
     * became outdated.
     *
     * Corresponding code can be retrieved with [`CodeByHash`].
     */
    PastCodeHash: StorageDescriptor<
      [Key: Anonymize<I9jd27rnpm8ttv>],
      FixedSizeBinary<32>,
      true,
      never
    >;
    /**
     * Past code of parachains. The parachains themselves may not be registered anymore,
     * but we also keep their code on-chain for the same amount of time as outdated code
     * to keep it available for approval checkers.
     */
    PastCodeMeta: StorageDescriptor<[Key: number], Anonymize<I79cs1p3m59mo7>, false, never>;
    /**
     * Which paras have past code that needs pruning and the relay-chain block at which the code
     * was replaced. Note that this is the actual height of the included block, not the expected
     * height at which the code upgrade would be applied, although they may be equal.
     * This is to ensure the entire acceptance period is covered, not an offset acceptance period
     * starting from the time at which the parachain perceives a code upgrade as having occurred.
     * Multiple entries for a single para are permitted. Ordered ascending by block number.
     */
    PastCodePruning: StorageDescriptor<[], Anonymize<I95g6i7ilua7lq>, false, never>;
    /**
     * The block number at which the planned code change is expected for a parachain.
     *
     * The change will be applied after the first parablock for this ID included which executes
     * in the context of a relay chain block with a number >= `expected_at`.
     */
    FutureCodeUpgrades: StorageDescriptor<[Key: number], number, true, never>;
    /**
     * The list of upcoming future code upgrades.
     *
     * Each item is a pair of the parachain and the expected block at which the upgrade should be
     * applied. The upgrade will be applied at the given relay chain block. In contrast to
     * [`FutureCodeUpgrades`] this code upgrade will be applied regardless the parachain making any
     * progress or not.
     *
     * Ordered ascending by block number.
     */
    FutureCodeUpgradesAt: StorageDescriptor<[], Anonymize<I95g6i7ilua7lq>, false, never>;
    /**
     * The actual future code hash of a para.
     *
     * Corresponding code can be retrieved with [`CodeByHash`].
     */
    FutureCodeHash: StorageDescriptor<[Key: number], FixedSizeBinary<32>, true, never>;
    /**
     * This is used by the relay-chain to communicate to a parachain a go-ahead with in the upgrade
     * procedure.
     *
     * This value is absent when there are no upgrades scheduled or during the time the relay chain
     * performs the checks. It is set at the first relay-chain block when the corresponding
     * parachain can switch its upgrade function. As soon as the parachain's block is included, the
     * value gets reset to `None`.
     *
     * NOTE that this field is used by parachains via merkle storage proofs, therefore changing
     * the format will require migration of parachains.
     */
    UpgradeGoAheadSignal: StorageDescriptor<[Key: number], UpgradeGoAhead, true, never>;
    /**
     * This is used by the relay-chain to communicate that there are restrictions for performing
     * an upgrade for this parachain.
     *
     * This may be a because the parachain waits for the upgrade cooldown to expire. Another
     * potential use case is when we want to perform some maintenance (such as storage migration)
     * we could restrict upgrades to make the process simpler.
     *
     * NOTE that this field is used by parachains via merkle storage proofs, therefore changing
     * the format will require migration of parachains.
     */
    UpgradeRestrictionSignal: StorageDescriptor<[Key: number], UpgradeRestriction, true, never>;
    /**
     * The list of parachains that are awaiting for their upgrade restriction to cooldown.
     *
     * Ordered ascending by block number.
     */
    UpgradeCooldowns: StorageDescriptor<[], Anonymize<I95g6i7ilua7lq>, false, never>;
    /**
     * The list of upcoming code upgrades.
     *
     * Each item is a pair of which para performs a code upgrade and at which relay-chain block it
     * is expected at.
     *
     * Ordered ascending by block number.
     */
    UpcomingUpgrades: StorageDescriptor<[], Anonymize<I95g6i7ilua7lq>, false, never>;
    /**
     * The actions to perform during the start of a specific session index.
     */
    ActionsQueue: StorageDescriptor<[Key: number], Anonymize<Icgljjb6j82uhn>, false, never>;
    /**
     * Upcoming paras instantiation arguments.
     *
     * NOTE that after PVF pre-checking is enabled the para genesis arg will have it's code set
     * to empty. Instead, the code will be saved into the storage right away via `CodeByHash`.
     */
    UpcomingParasGenesis: StorageDescriptor<[Key: number], Anonymize<I2duhnt686rv0q>, true, never>;
    /**
     * The number of reference on the validation code in [`CodeByHash`] storage.
     */
    CodeByHashRefs: StorageDescriptor<[Key: FixedSizeBinary<32>], number, false, never>;
    /**
     * Validation code stored by its hash.
     *
     * This storage is consistent with [`FutureCodeHash`], [`CurrentCodeHash`] and
     * [`PastCodeHash`].
     */
    CodeByHash: StorageDescriptor<[Key: FixedSizeBinary<32>], Binary, true, never>;
  };
  Initializer: {
    /**
     * Whether the parachains modules have been initialized within this block.
     *
     * Semantically a `bool`, but this guarantees it should never hit the trie,
     * as this is cleared in `on_finalize` and Frame optimizes `None` values to be empty values.
     *
     * As a `bool`, `set(false)` and `remove()` both lead to the next `get()` being false, but one
     * of them writes to the trie and one does not. This confusion makes `Option<()>` more suitable
     * for the semantics of this variable.
     */
    HasInitialized: StorageDescriptor<[], null, true, never>;
    /**
     * Buffered session changes along with the block number at which they should be applied.
     *
     * Typically this will be empty or one element long. Apart from that this item never hits
     * the storage.
     *
     * However this is a `Vec` regardless to handle various edge cases that may occur at runtime
     * upgrade boundaries or if governance intervenes.
     */
    BufferedSessionChanges: StorageDescriptor<[], Anonymize<I7ulu3h1ibu60i>, false, never>;
  };
  Dmp: {
    /**
     * The downward messages addressed for a certain para.
     */
    DownwardMessageQueues: StorageDescriptor<
      [Key: number],
      Anonymize<I6ljjd4b5fa4ov>,
      false,
      never
    >;
    /**
     * A mapping that stores the downward message queue MQC head for each para.
     *
     * Each link in this chain has a form:
     * `(prev_head, B, H(M))`, where
     * - `prev_head`: is the previous head hash or zero if none.
     * - `B`: is the relay-chain block number in which a message was appended.
     * - `H(M)`: is the hash of the message being appended.
     */
    DownwardMessageQueueHeads: StorageDescriptor<[Key: number], FixedSizeBinary<32>, false, never>;
    /**
     * The factor to multiply the base delivery fee by.
     */
    DeliveryFeeFactor: StorageDescriptor<[Key: number], bigint, false, never>;
  };
  Hrmp: {
    /**
     * The set of pending HRMP open channel requests.
     *
     * The set is accompanied by a list for iteration.
     *
     * Invariant:
     * - There are no channels that exists in list but not in the set and vice versa.
     */
    HrmpOpenChannelRequests: StorageDescriptor<
      [Key: Anonymize<I50mrcbubp554e>],
      Anonymize<Ibhmrlkcu01imb>,
      true,
      never
    >;
    /**
        
         */
    HrmpOpenChannelRequestsList: StorageDescriptor<[], Anonymize<Id43g4eveajpkl>, false, never>;
    /**
     * This mapping tracks how many open channel requests are initiated by a given sender para.
     * Invariant: `HrmpOpenChannelRequests` should contain the same number of items that has
     * `(X, _)` as the number of `HrmpOpenChannelRequestCount` for `X`.
     */
    HrmpOpenChannelRequestCount: StorageDescriptor<[Key: number], number, false, never>;
    /**
     * This mapping tracks how many open channel requests were accepted by a given recipient para.
     * Invariant: `HrmpOpenChannelRequests` should contain the same number of items `(_, X)` with
     * `confirmed` set to true, as the number of `HrmpAcceptedChannelRequestCount` for `X`.
     */
    HrmpAcceptedChannelRequestCount: StorageDescriptor<[Key: number], number, false, never>;
    /**
     * A set of pending HRMP close channel requests that are going to be closed during the session
     * change. Used for checking if a given channel is registered for closure.
     *
     * The set is accompanied by a list for iteration.
     *
     * Invariant:
     * - There are no channels that exists in list but not in the set and vice versa.
     */
    HrmpCloseChannelRequests: StorageDescriptor<
      [Key: Anonymize<I50mrcbubp554e>],
      null,
      true,
      never
    >;
    /**
        
         */
    HrmpCloseChannelRequestsList: StorageDescriptor<[], Anonymize<Id43g4eveajpkl>, false, never>;
    /**
     * The HRMP watermark associated with each para.
     * Invariant:
     * - each para `P` used here as a key should satisfy `Paras::is_valid_para(P)` within a
     * session.
     */
    HrmpWatermarks: StorageDescriptor<[Key: number], number, true, never>;
    /**
     * HRMP channel data associated with each para.
     * Invariant:
     * - each participant in the channel should satisfy `Paras::is_valid_para(P)` within a session.
     */
    HrmpChannels: StorageDescriptor<
      [Key: Anonymize<I50mrcbubp554e>],
      Anonymize<I7iua3ehrgl4va>,
      true,
      never
    >;
    /**
     * Ingress/egress indexes allow to find all the senders and receivers given the opposite side.
     * I.e.
     *
     * (a) ingress index allows to find all the senders for a given recipient.
     * (b) egress index allows to find all the recipients for a given sender.
     *
     * Invariants:
     * - for each ingress index entry for `P` each item `I` in the index should present in
     * `HrmpChannels` as `(I, P)`.
     * - for each egress index entry for `P` each item `E` in the index should present in
     * `HrmpChannels` as `(P, E)`.
     * - there should be no other dangling channels in `HrmpChannels`.
     * - the vectors are sorted.
     */
    HrmpIngressChannelsIndex: StorageDescriptor<
      [Key: number],
      Anonymize<Icgljjb6j82uhn>,
      false,
      never
    >;
    /**
        
         */
    HrmpEgressChannelsIndex: StorageDescriptor<
      [Key: number],
      Anonymize<Icgljjb6j82uhn>,
      false,
      never
    >;
    /**
     * Storage for the messages for each channel.
     * Invariant: cannot be non-empty if the corresponding channel in `HrmpChannels` is `None`.
     */
    HrmpChannelContents: StorageDescriptor<
      [Key: Anonymize<I50mrcbubp554e>],
      Anonymize<Iev3u09i2vqn93>,
      false,
      never
    >;
    /**
     * Maintains a mapping that can be used to answer the question: What paras sent a message at
     * the given block number for a given receiver. Invariants:
     * - The inner `Vec<ParaId>` is never empty.
     * - The inner `Vec<ParaId>` cannot store two same `ParaId`.
     * - The outer vector is sorted ascending by block number and cannot store two items with the
     * same block number.
     */
    HrmpChannelDigests: StorageDescriptor<[Key: number], Anonymize<I9olhgo2o08h7b>, false, never>;
  };
  ParaSessionInfo: {
    /**
     * Assignment keys for the current session.
     * Note that this API is private due to it being prone to 'off-by-one' at session boundaries.
     * When in doubt, use `Sessions` API instead.
     */
    AssignmentKeysUnsafe: StorageDescriptor<[], Anonymize<Ic5m5lp1oioo8r>, false, never>;
    /**
     * The earliest session for which previous session info is stored.
     */
    EarliestStoredSession: StorageDescriptor<[], number, false, never>;
    /**
     * Session information in a rolling window.
     * Should have an entry in range `EarliestStoredSession..=CurrentSessionIndex`.
     * Does not have any entries before the session index in the first session change notification.
     */
    Sessions: StorageDescriptor<[Key: number], Anonymize<I9m4rd2a7lc9md>, true, never>;
    /**
     * The validator account keys of the validators actively participating in parachain consensus.
     */
    AccountKeys: StorageDescriptor<[Key: number], Anonymize<Ia2lhg7l2hilo3>, true, never>;
    /**
     * Executor parameter set for a given session index
     */
    SessionExecutorParams: StorageDescriptor<[Key: number], Anonymize<I80rnntpog8qp6>, true, never>;
  };
  ParasDisputes: {
    /**
     * The last pruned session, if any. All data stored by this module
     * references sessions.
     */
    LastPrunedSession: StorageDescriptor<[], number, true, never>;
    /**
     * All ongoing or concluded disputes for the last several sessions.
     */
    Disputes: StorageDescriptor<Anonymize<I4p5t2krb1gmvp>, Anonymize<I87u7jalc0lhah>, true, never>;
    /**
     * Backing votes stored for each dispute.
     * This storage is used for slashing.
     */
    BackersOnDisputes: StorageDescriptor<
      Anonymize<I4p5t2krb1gmvp>,
      Anonymize<Icgljjb6j82uhn>,
      true,
      never
    >;
    /**
     * All included blocks on the chain, as well as the block number in this chain that
     * should be reverted back to if the candidate is disputed and determined to be invalid.
     */
    Included: StorageDescriptor<Anonymize<I4p5t2krb1gmvp>, number, true, never>;
    /**
     * Whether the chain is frozen. Starts as `None`. When this is `Some`,
     * the chain will not accept any new parachain blocks for backing or inclusion,
     * and its value indicates the last valid block number in the chain.
     * It can only be set back to `None` by governance intervention.
     */
    Frozen: StorageDescriptor<[], Anonymize<I4arjljr6dpflb>, false, never>;
  };
  ParasSlashing: {
    /**
     * Validators pending dispute slashes.
     */
    UnappliedSlashes: StorageDescriptor<
      Anonymize<I4p5t2krb1gmvp>,
      Anonymize<I5kqchhvguhfvt>,
      true,
      never
    >;
    /**
     * `ValidatorSetCount` per session.
     */
    ValidatorSetCounts: StorageDescriptor<[Key: number], number, true, never>;
  };
  OnDemandAssignmentProvider: {
    /**
     * Maps a `ParaId` to `CoreIndex` and keeps track of how many assignments the scheduler has in
     * it's lookahead. Keeping track of this affinity prevents parallel execution of the same
     * `ParaId` on two or more `CoreIndex`es.
     */
    ParaIdAffinity: StorageDescriptor<[Key: number], Anonymize<I4akf1ifqeclef>, true, never>;
    /**
     * Overall status of queue (both free + affinity entries)
     */
    QueueStatus: StorageDescriptor<[], Anonymize<Ido5stnsbghtpd>, false, never>;
    /**
     * Priority queue for all orders which don't yet (or not any more) have any core affinity.
     */
    FreeEntries: StorageDescriptor<[], Anonymize<I3ndpvu09rj685>, false, never>;
    /**
     * Queue entries that are currently bound to a particular core due to core affinity.
     */
    AffinityEntries: StorageDescriptor<[Key: number], Anonymize<I3ndpvu09rj685>, false, never>;
    /**
     * Keeps track of accumulated revenue from on demand order sales.
     */
    Revenue: StorageDescriptor<[], Anonymize<Iafqnechp3omqg>, false, never>;
  };
  CoretimeAssignmentProvider: {
    /**
     * Scheduled assignment sets.
     *
     * Assignments as of the given block number. They will go into state once the block number is
     * reached (and replace whatever was in there before).
     */
    CoreSchedules: StorageDescriptor<
      [Key: Anonymize<I9jd27rnpm8ttv>],
      Anonymize<I9dasmua8326io>,
      true,
      '0'
    >;
    /**
     * Assignments which are currently active.
     *
     * They will be picked from `PendingAssignments` once we reach the scheduled block number in
     * `PendingAssignments`.
     */
    CoreDescriptors: StorageDescriptor<[Key: number], Anonymize<I3g90iebhds6kb>, false, '0'>;
  };
  Registrar: {
    /**
     * Pending swap operations.
     */
    PendingSwap: StorageDescriptor<[Key: number], number, true, never>;
    /**
     * Amount held on deposit for each para and the original depositor.
     *
     * The given account ID is responsible for registering the code and initial head data, but may
     * only do so if it isn't yet registered. (After that, it's up to governance to do so.)
     */
    Paras: StorageDescriptor<[Key: number], Anonymize<I3av628q6dt6mq>, true, never>;
    /**
     * The next free `ParaId`.
     */
    NextFreeParaId: StorageDescriptor<[], number, false, never>;
  };
  Slots: {
    /**
     * Amounts held on deposit for each (possibly future) leased parachain.
     *
     * The actual amount locked on its behalf by any account at any time is the maximum of the
     * second values of the items in this list whose first value is the account.
     *
     * The first item in the list is the amount locked for the current Lease Period. Following
     * items are for the subsequent lease periods.
     *
     * The default value (an empty list) implies that the parachain no longer exists (or never
     * existed) as far as this pallet is concerned.
     *
     * If a parachain doesn't exist *yet* but is scheduled to exist in the future, then it
     * will be left-padded with one or more `None`s to denote the fact that nothing is held on
     * deposit for the non-existent chain currently, but is held at some point in the future.
     *
     * It is illegal for a `None` value to trail in the list.
     */
    Leases: StorageDescriptor<[Key: number], Anonymize<Ifmaahl40gom3g>, false, never>;
  };
  Auctions: {
    /**
     * Number of auctions started so far.
     */
    AuctionCounter: StorageDescriptor<[], number, false, never>;
    /**
     * Information relating to the current auction, if there is one.
     *
     * The first item in the tuple is the lease period index that the first of the four
     * contiguous lease periods on auction is for. The second is the block number when the
     * auction will "begin to end", i.e. the first block of the Ending Period of the auction.
     */
    AuctionInfo: StorageDescriptor<[], Anonymize<I9jd27rnpm8ttv>, true, never>;
    /**
     * Amounts currently reserved in the accounts of the bidders currently winning
     * (sub-)ranges.
     */
    ReservedAmounts: StorageDescriptor<[Key: Anonymize<I6ouflveob4eli>], bigint, true, never>;
    /**
     * The winning bids for each of the 10 ranges at each sample in the final Ending Period of
     * the current auction. The map's key is the 0-based index into the Sample Size. The
     * first sample of the ending period is 0; the last is `Sample Size - 1`.
     */
    Winning: StorageDescriptor<[Key: number], Anonymize<I70iuri2ilha1f>, true, never>;
  };
  Crowdloan: {
    /**
     * Info on all of the funds.
     */
    Funds: StorageDescriptor<[Key: number], Anonymize<I6gun5k9fbb4s0>, true, never>;
    /**
     * The funds that have had additional contributions during the last block. This is used
     * in order to determine which funds should submit new or updated bids.
     */
    NewRaise: StorageDescriptor<[], Anonymize<Icgljjb6j82uhn>, false, never>;
    /**
     * The number of auctions that have entered into their ending period so far.
     */
    EndingsCount: StorageDescriptor<[], number, false, never>;
    /**
     * Tracker for the next available fund index
     */
    NextFundIndex: StorageDescriptor<[], number, false, never>;
  };
  XcmPallet: {
    /**
     * The latest available query index.
     */
    QueryCounter: StorageDescriptor<[], bigint, false, never>;
    /**
     * The ongoing queries.
     */
    Queries: StorageDescriptor<[Key: bigint], XcmPalletQueryStatus, true, never>;
    /**
     * The existing asset traps.
     *
     * Key is the blake2 256 hash of (origin, versioned `Assets`) pair. Value is the number of
     * times this pair has been trapped (usually just 1 if it exists at all).
     */
    AssetTraps: StorageDescriptor<[Key: FixedSizeBinary<32>], number, false, never>;
    /**
     * Default version to encode XCM when latest version of destination is unknown. If `None`,
     * then the destinations whose XCM version is unknown are considered unreachable.
     */
    SafeXcmVersion: StorageDescriptor<[], number, true, never>;
    /**
     * The Latest versions that we know various locations support.
     */
    SupportedVersion: StorageDescriptor<Anonymize<Ic4qvh5df9s5gp>, number, true, never>;
    /**
     * All locations that we have requested version notifications from.
     */
    VersionNotifiers: StorageDescriptor<Anonymize<Ic4qvh5df9s5gp>, bigint, true, never>;
    /**
     * The target locations that are subscribed to our version changes, as well as the most recent
     * of our versions we informed them of.
     */
    VersionNotifyTargets: StorageDescriptor<
      Anonymize<Ic4qvh5df9s5gp>,
      Anonymize<I7vlvrrl2pnbgk>,
      true,
      never
    >;
    /**
     * Destinations whose latest XCM version we would like to know. Duplicates not allowed, and
     * the `u32` counter is the number of times that a send to the destination has been attempted,
     * which is used as a prioritization.
     */
    VersionDiscoveryQueue: StorageDescriptor<[], Anonymize<I50sjs3s5lud21>, false, never>;
    /**
     * The current migration's stage, if any.
     */
    CurrentMigration: StorageDescriptor<[], XcmPalletVersionMigrationStage, true, never>;
    /**
     * Fungible assets which we know are locked on a remote chain.
     */
    RemoteLockedFungibles: StorageDescriptor<
      Anonymize<Iteuj23is2ed5>,
      Anonymize<I50qp0ij7h62g2>,
      true,
      never
    >;
    /**
     * Fungible assets which we know are locked on this chain.
     */
    LockedFungibles: StorageDescriptor<[Key: SS58String], Anonymize<I3rp19gb4dadaa>, true, never>;
    /**
     * Global suspension state of the XCM executor.
     */
    XcmExecutionSuspended: StorageDescriptor<[], boolean, false, never>;
    /**
     * Whether or not incoming XCMs (both executed locally and received) should be recorded.
     * Only one XCM program will be recorded at a time.
     * This is meant to be used in runtime APIs, and it's advised it stays false
     * for all other use cases, so as to not degrade regular performance.
     *
     * Only relevant if this pallet is being used as the [`xcm_executor::traits::RecordXcm`]
     * implementation in the XCM executor configuration.
     */
    ShouldRecordXcm: StorageDescriptor<[], boolean, false, never>;
    /**
     * If [`ShouldRecordXcm`] is set to true, then the last XCM program executed locally
     * will be stored here.
     * Runtime APIs can fetch the XCM that was executed by accessing this value.
     *
     * Only relevant if this pallet is being used as the [`xcm_executor::traits::RecordXcm`]
     * implementation in the XCM executor configuration.
     */
    RecordedXcm: StorageDescriptor<[], Anonymize<Iegrepoo0c1jc5>, true, never>;
  };
  MessageQueue: {
    /**
     * The index of the first and last (non-empty) pages.
     */
    BookStateFor: StorageDescriptor<
      [Key: ParachainsInclusionAggregateMessageOrigin],
      Anonymize<I260m120dp9sbk>,
      false,
      never
    >;
    /**
     * The origin at which we should begin servicing.
     */
    ServiceHead: StorageDescriptor<[], ParachainsInclusionAggregateMessageOrigin, true, never>;
    /**
     * The map of page indices to pages.
     */
    Pages: StorageDescriptor<Anonymize<I1lfimt2mpej64>, Anonymize<I53esa2ms463bk>, true, never>;
  };
  AssetRate: {
    /**
     * Maps an asset to its fixed point representation in the native balance.
     *
     * E.g. `native_amount = asset_amount * ConversionRateToNative::<T>::get(asset_kind)`
     */
    ConversionRateToNative: StorageDescriptor<[Key: VersionedLocatableAsset], bigint, true, never>;
  };
  Beefy: {
    /**
     * The current authorities set
     */
    Authorities: StorageDescriptor<[], Anonymize<I2fb54desdqd9n>, false, never>;
    /**
     * The current validator set id
     */
    ValidatorSetId: StorageDescriptor<[], bigint, false, never>;
    /**
     * Authorities set scheduled to be used with the next session
     */
    NextAuthorities: StorageDescriptor<[], Anonymize<I2fb54desdqd9n>, false, never>;
    /**
     * A mapping from BEEFY set ID to the index of the *most recent* session for which its
     * members were responsible.
     *
     * This is only used for validating equivocation proofs. An equivocation proof must
     * contains a key-ownership proof for a given session, therefore we need a way to tie
     * together sessions and BEEFY set ids, i.e. we need to validate that a validator
     * was the owner of a given key on a given session, and what the active set ID was
     * during that session.
     *
     * TWOX-NOTE: `ValidatorSetId` is not under user control.
     */
    SetIdSession: StorageDescriptor<[Key: bigint], number, true, never>;
    /**
     * Block number where BEEFY consensus is enabled/started.
     * By changing this (through privileged `set_new_genesis()`), BEEFY consensus is effectively
     * restarted from the newly set block number.
     */
    GenesisBlock: StorageDescriptor<[], Anonymize<I4arjljr6dpflb>, false, never>;
  };
  Mmr: {
    /**
     * Latest MMR Root hash.
     */
    RootHash: StorageDescriptor<[], FixedSizeBinary<32>, false, never>;
    /**
     * Current size of the MMR (number of leaves).
     */
    NumberOfLeaves: StorageDescriptor<[], bigint, false, never>;
    /**
     * Hashes of the nodes in the MMR.
     *
     * Note this collection only contains MMR peaks, the inner nodes (and leaves)
     * are pruned and only stored in the Offchain DB.
     */
    Nodes: StorageDescriptor<[Key: bigint], FixedSizeBinary<32>, true, never>;
  };
  BeefyMmrLeaf: {
    /**
     * Details of current BEEFY authority set.
     */
    BeefyAuthorities: StorageDescriptor<[], Anonymize<Idjett00s2gd>, false, never>;
    /**
     * Details of next BEEFY authority set.
     *
     * This storage entry is used as cache for calls to `update_beefy_next_authority_set`.
     */
    BeefyNextAuthorities: StorageDescriptor<[], Anonymize<Idjett00s2gd>, false, never>;
  };
};
type ICalls = {
  System: {
    /**
     * Make some on-chain remark.
     *
     * Can be executed by every `origin`.
     */
    remark: TxDescriptor<Anonymize<I8ofcg5rbj0g2c>>;
    /**
     * Set the number of pages in the WebAssembly environment's heap.
     */
    set_heap_pages: TxDescriptor<Anonymize<I4adgbll7gku4i>>;
    /**
     * Set the new runtime code.
     */
    set_code: TxDescriptor<Anonymize<I6pjjpfvhvcfru>>;
    /**
     * Set the new runtime code without doing any checks of the given `code`.
     *
     * Note that runtime upgrades will not run if this is called with a not-increasing spec
     * version!
     */
    set_code_without_checks: TxDescriptor<Anonymize<I6pjjpfvhvcfru>>;
    /**
     * Set some items of storage.
     */
    set_storage: TxDescriptor<Anonymize<I9pj91mj79qekl>>;
    /**
     * Kill some items from storage.
     */
    kill_storage: TxDescriptor<Anonymize<I39uah9nss64h9>>;
    /**
     * Kill all storage items with a key that starts with the given prefix.
     *
     * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
     * the prefix we are removing to accurately calculate the weight of this function.
     */
    kill_prefix: TxDescriptor<Anonymize<Ik64dknsq7k08>>;
    /**
     * Make some on-chain remark and emit event.
     */
    remark_with_event: TxDescriptor<Anonymize<I8ofcg5rbj0g2c>>;
    /**
     * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
     * later.
     *
     * This call requires Root origin.
     */
    authorize_upgrade: TxDescriptor<Anonymize<Ib51vk42m1po4n>>;
    /**
     * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
     * later.
     *
     * WARNING: This authorizes an upgrade that will take place without any safety checks, for
     * example that the spec name remains the same and that the version number increases. Not
     * recommended for normal use. Use `authorize_upgrade` instead.
     *
     * This call requires Root origin.
     */
    authorize_upgrade_without_checks: TxDescriptor<Anonymize<Ib51vk42m1po4n>>;
    /**
     * Provide the preimage (runtime binary) `code` for an upgrade that has been authorized.
     *
     * If the authorization required a version check, this call will ensure the spec name
     * remains unchanged and that the spec version has increased.
     *
     * Depending on the runtime's `OnSetCode` configuration, this function may directly apply
     * the new `code` in the same block or attempt to schedule the upgrade.
     *
     * All origins are allowed.
     */
    apply_authorized_upgrade: TxDescriptor<Anonymize<I6pjjpfvhvcfru>>;
  };
  Babe: {
    /**
     * Report authority equivocation/misbehavior. This method will verify
     * the equivocation proof and validate the given key ownership proof
     * against the extracted offender. If both are valid, the offence will
     * be reported.
     */
    report_equivocation: TxDescriptor<Anonymize<I50ppnqasq4tjq>>;
    /**
     * Report authority equivocation/misbehavior. This method will verify
     * the equivocation proof and validate the given key ownership proof
     * against the extracted offender. If both are valid, the offence will
     * be reported.
     * This extrinsic must be called unsigned and it is expected that only
     * block authors will call it (validated in `ValidateUnsigned`), as such
     * if the block author is defined it will be defined as the equivocation
     * reporter.
     */
    report_equivocation_unsigned: TxDescriptor<Anonymize<I50ppnqasq4tjq>>;
    /**
     * Plan an epoch config change. The epoch config change is recorded and will be enacted on
     * the next call to `enact_epoch_change`. The config will be activated one epoch after.
     * Multiple calls to this method will replace any existing planned config change that had
     * not been enacted yet.
     */
    plan_config_change: TxDescriptor<Anonymize<I9fin09kkg0jaj>>;
  };
  Timestamp: {
    /**
     * Set the current time.
     *
     * This call should be invoked exactly once per block. It will panic at the finalization
     * phase, if this call hasn't been invoked by that time.
     *
     * The timestamp should be greater than the previous one by the amount specified by
     * [`Config::MinimumPeriod`].
     *
     * The dispatch origin for this call must be _None_.
     *
     * This dispatch class is _Mandatory_ to ensure it gets executed in the block. Be aware
     * that changing the complexity of this call could result exhausting the resources in a
     * block to execute any other calls.
     *
     * ## Complexity
     * - `O(1)` (Note that implementations of `OnTimestampSet` must also be `O(1)`)
     * - 1 storage read and 1 storage mutation (codec `O(1)` because of `DidUpdate::take` in
     * `on_finalize`)
     * - 1 event handler `on_timestamp_set`. Must be `O(1)`.
     */
    set: TxDescriptor<Anonymize<Idcr6u6361oad9>>;
  };
  Indices: {
    /**
     * Assign an previously unassigned index.
     *
     * Payment: `Deposit` is reserved from the sender account.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `index`: the index to be claimed. This must not be in use.
     *
     * Emits `IndexAssigned` if successful.
     *
     * ## Complexity
     * - `O(1)`.
     */
    claim: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Assign an index already owned by the sender to another account. The balance reservation
     * is effectively transferred to the new account.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `index`: the index to be re-assigned. This must be owned by the sender.
     * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
     *
     * Emits `IndexAssigned` if successful.
     *
     * ## Complexity
     * - `O(1)`.
     */
    transfer: TxDescriptor<Anonymize<I6o1er683vod1j>>;
    /**
     * Free up an index owned by the sender.
     *
     * Payment: Any previous deposit placed for the index is unreserved in the sender account.
     *
     * The dispatch origin for this call must be _Signed_ and the sender must own the index.
     *
     * - `index`: the index to be freed. This must be owned by the sender.
     *
     * Emits `IndexFreed` if successful.
     *
     * ## Complexity
     * - `O(1)`.
     */
    free: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Force an index to an account. This doesn't require a deposit. If the index is already
     * held, then any deposit is reimbursed to its current owner.
     *
     * The dispatch origin for this call must be _Root_.
     *
     * - `index`: the index to be (re-)assigned.
     * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
     * - `freeze`: if set to `true`, will freeze the index so it cannot be transferred.
     *
     * Emits `IndexAssigned` if successful.
     *
     * ## Complexity
     * - `O(1)`.
     */
    force_transfer: TxDescriptor<Anonymize<I5bq561t4gpfva>>;
    /**
     * Freeze an index so it will always point to the sender account. This consumes the
     * deposit.
     *
     * The dispatch origin for this call must be _Signed_ and the signing account must have a
     * non-frozen account `index`.
     *
     * - `index`: the index to be frozen in place.
     *
     * Emits `IndexFrozen` if successful.
     *
     * ## Complexity
     * - `O(1)`.
     */
    freeze: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
  };
  Balances: {
    /**
     * Transfer some liquid free balance to another account.
     *
     * `transfer_allow_death` will set the `FreeBalance` of the sender and receiver.
     * If the sender's account is below the existential deposit as a result
     * of the transfer, the account will be reaped.
     *
     * The dispatch origin for this call must be `Signed` by the transactor.
     */
    transfer_allow_death: TxDescriptor<Anonymize<I4ktuaksf5i1gk>>;
    /**
     * Exactly as `transfer_allow_death`, except the origin must be root and the source account
     * may be specified.
     */
    force_transfer: TxDescriptor<Anonymize<I9bqtpv2ii35mp>>;
    /**
     * Same as the [`transfer_allow_death`] call, but with a check that the transfer will not
     * kill the origin account.
     *
     * 99% of the time you want [`transfer_allow_death`] instead.
     *
     * [`transfer_allow_death`]: struct.Pallet.html#method.transfer
     */
    transfer_keep_alive: TxDescriptor<Anonymize<I4ktuaksf5i1gk>>;
    /**
     * Transfer the entire transferable balance from the caller account.
     *
     * NOTE: This function only attempts to transfer _transferable_ balances. This means that
     * any locked, reserved, or existential deposits (when `keep_alive` is `true`), will not be
     * transferred by this function. To ensure that this function results in a killed account,
     * you might need to prepare the account by removing any reference counters, storage
     * deposits, etc...
     *
     * The dispatch origin of this call must be Signed.
     *
     * - `dest`: The recipient of the transfer.
     * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
     * of the funds the account has, causing the sender account to be killed (false), or
     * transfer everything except at least the existential deposit, which will guarantee to
     * keep the sender account alive (true).
     */
    transfer_all: TxDescriptor<Anonymize<I9j7pagd6d4bda>>;
    /**
     * Unreserve some balance from a user by force.
     *
     * Can only be called by ROOT.
     */
    force_unreserve: TxDescriptor<Anonymize<I2h9pmio37r7fb>>;
    /**
     * Upgrade a specified account.
     *
     * - `origin`: Must be `Signed`.
     * - `who`: The account to be upgraded.
     *
     * This will waive the transaction fee if at least all but 10% of the accounts needed to
     * be upgraded. (We let some not have to be upgraded just in order to allow for the
     * possibility of churn).
     */
    upgrade_accounts: TxDescriptor<Anonymize<Ibmr18suc9ikh9>>;
    /**
     * Set the regular balance of a given account.
     *
     * The dispatch origin for this call is `root`.
     */
    force_set_balance: TxDescriptor<Anonymize<I9iq22t0burs89>>;
    /**
     * Adjust the total issuance in a saturating way.
     *
     * Can only be called by root and always needs a positive `delta`.
     *
     * # Example
     */
    force_adjust_total_issuance: TxDescriptor<Anonymize<I5u8olqbbvfnvf>>;
    /**
     * Burn the specified liquid free balance from the origin account.
     *
     * If the origin's account ends up below the existential deposit as a result
     * of the burn and `keep_alive` is false, the account will be reaped.
     *
     * Unlike sending funds to a _burn_ address, which merely makes the funds inaccessible,
     * this `burn` operation will reduce total issuance by the amount _burned_.
     */
    burn: TxDescriptor<Anonymize<I5utcetro501ir>>;
  };
  Staking: {
    /**
     * Take the origin account as a stash and lock up `value` of its balance. `controller` will
     * be the account that controls it.
     *
     * `value` must be more than the `minimum_balance` specified by `T::Currency`.
     *
     * The dispatch origin for this call must be _Signed_ by the stash account.
     *
     * Emits `Bonded`.
     * ## Complexity
     * - Independent of the arguments. Moderate complexity.
     * - O(1).
     * - Three extra DB entries.
     *
     * NOTE: Two of the storage writes (`Self::bonded`, `Self::payee`) are _never_ cleaned
     * unless the `origin` falls below _existential deposit_ (or equal to 0) and gets removed
     * as dust.
     */
    bond: TxDescriptor<Anonymize<I2eip8tc75dpje>>;
    /**
     * Add some extra amount that have appeared in the stash `free_balance` into the balance up
     * for staking.
     *
     * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
     *
     * Use this if there are additional funds in your stash account that you wish to bond.
     * Unlike [`bond`](Self::bond) or [`unbond`](Self::unbond) this function does not impose
     * any limitation on the amount that can be added.
     *
     * Emits `Bonded`.
     *
     * ## Complexity
     * - Independent of the arguments. Insignificant complexity.
     * - O(1).
     */
    bond_extra: TxDescriptor<Anonymize<I564va64vtidbq>>;
    /**
     * Schedule a portion of the stash to be unlocked ready for transfer out after the bond
     * period ends. If this leaves an amount actively bonded less than
     * T::Currency::minimum_balance(), then it is increased to the full amount.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     *
     * Once the unlock period is done, you can call `withdraw_unbonded` to actually move
     * the funds out of management ready for transfer.
     *
     * No more than a limited number of unlocking chunks (see `MaxUnlockingChunks`)
     * can co-exists at the same time. If there are no unlocking chunks slots available
     * [`Call::withdraw_unbonded`] is called to remove some of the chunks (if possible).
     *
     * If a user encounters the `InsufficientBond` error when calling this extrinsic,
     * they should call `chill` first in order to free up their bonded funds.
     *
     * Emits `Unbonded`.
     *
     * See also [`Call::withdraw_unbonded`].
     */
    unbond: TxDescriptor<Anonymize<Ie5v6njpckr05b>>;
    /**
     * Remove any unlocked chunks from the `unlocking` queue from our management.
     *
     * This essentially frees up that balance to be used by the stash account to do whatever
     * it wants.
     *
     * The dispatch origin for this call must be _Signed_ by the controller.
     *
     * Emits `Withdrawn`.
     *
     * See also [`Call::unbond`].
     *
     * ## Parameters
     *
     * - `num_slashing_spans` indicates the number of metadata slashing spans to clear when
     * this call results in a complete removal of all the data related to the stash account.
     * In this case, the `num_slashing_spans` must be larger or equal to the number of
     * slashing spans associated with the stash account in the [`SlashingSpans`] storage type,
     * otherwise the call will fail. The call weight is directly proportional to
     * `num_slashing_spans`.
     *
     * ## Complexity
     * O(S) where S is the number of slashing spans to remove
     * NOTE: Weight annotation is the kill scenario, we refund otherwise.
     */
    withdraw_unbonded: TxDescriptor<Anonymize<I328av3j0bgmjb>>;
    /**
     * Declare the desire to validate for the origin controller.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     */
    validate: TxDescriptor<Anonymize<I4tuqm9ato907i>>;
    /**
     * Declare the desire to nominate `targets` for the origin controller.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     *
     * ## Complexity
     * - The transaction's complexity is proportional to the size of `targets` (N)
     * which is capped at CompactAssignments::LIMIT (T::MaxNominations).
     * - Both the reads and writes follow a similar pattern.
     */
    nominate: TxDescriptor<Anonymize<Iagi89qt4h1lqg>>;
    /**
     * Declare no desire to either validate or nominate.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     *
     * ## Complexity
     * - Independent of the arguments. Insignificant complexity.
     * - Contains one read.
     * - Writes are limited to the `origin` account key.
     */
    chill: TxDescriptor<undefined>;
    /**
     * (Re-)set the payment target for a controller.
     *
     * Effects will be felt instantly (as soon as this function is completed successfully).
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     *
     * ## Complexity
     * - O(1)
     * - Independent of the arguments. Insignificant complexity.
     * - Contains a limited number of reads.
     * - Writes are limited to the `origin` account key.
     * ---------
     */
    set_payee: TxDescriptor<Anonymize<I9dgmcnuamt5p8>>;
    /**
     * (Re-)sets the controller of a stash to the stash itself. This function previously
     * accepted a `controller` argument to set the controller to an account other than the
     * stash itself. This functionality has now been removed, now only setting the controller
     * to the stash, if it is not already.
     *
     * Effects will be felt instantly (as soon as this function is completed successfully).
     *
     * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
     *
     * ## Complexity
     * O(1)
     * - Independent of the arguments. Insignificant complexity.
     * - Contains a limited number of reads.
     * - Writes are limited to the `origin` account key.
     */
    set_controller: TxDescriptor<undefined>;
    /**
     * Sets the ideal number of validators.
     *
     * The dispatch origin must be Root.
     *
     * ## Complexity
     * O(1)
     */
    set_validator_count: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Increments the ideal number of validators up to maximum of
     * `ElectionProviderBase::MaxWinners`.
     *
     * The dispatch origin must be Root.
     *
     * ## Complexity
     * Same as [`Self::set_validator_count`].
     */
    increase_validator_count: TxDescriptor<Anonymize<Ifhs60omlhvt3>>;
    /**
     * Scale up the ideal number of validators by a factor up to maximum of
     * `ElectionProviderBase::MaxWinners`.
     *
     * The dispatch origin must be Root.
     *
     * ## Complexity
     * Same as [`Self::set_validator_count`].
     */
    scale_validator_count: TxDescriptor<Anonymize<If34udpd5e57vi>>;
    /**
     * Force there to be no new eras indefinitely.
     *
     * The dispatch origin must be Root.
     *
     * # Warning
     *
     * The election process starts multiple blocks before the end of the era.
     * Thus the election process may be ongoing when this is called. In this case the
     * election will continue until the next era is triggered.
     *
     * ## Complexity
     * - No arguments.
     * - Weight: O(1)
     */
    force_no_eras: TxDescriptor<undefined>;
    /**
     * Force there to be a new era at the end of the next session. After this, it will be
     * reset to normal (non-forced) behaviour.
     *
     * The dispatch origin must be Root.
     *
     * # Warning
     *
     * The election process starts multiple blocks before the end of the era.
     * If this is called just before a new era is triggered, the election process may not
     * have enough blocks to get a result.
     *
     * ## Complexity
     * - No arguments.
     * - Weight: O(1)
     */
    force_new_era: TxDescriptor<undefined>;
    /**
     * Set the validators who cannot be slashed (if any).
     *
     * The dispatch origin must be Root.
     */
    set_invulnerables: TxDescriptor<Anonymize<I39t01nnod9109>>;
    /**
     * Force a current staker to become completely unstaked, immediately.
     *
     * The dispatch origin must be Root.
     *
     * ## Parameters
     *
     * - `num_slashing_spans`: Refer to comments on [`Call::withdraw_unbonded`] for more
     * details.
     */
    force_unstake: TxDescriptor<Anonymize<Ie5vbnd9198quk>>;
    /**
     * Force there to be a new era at the end of sessions indefinitely.
     *
     * The dispatch origin must be Root.
     *
     * # Warning
     *
     * The election process starts multiple blocks before the end of the era.
     * If this is called just before a new era is triggered, the election process may not
     * have enough blocks to get a result.
     */
    force_new_era_always: TxDescriptor<undefined>;
    /**
     * Cancel enactment of a deferred slash.
     *
     * Can be called by the `T::AdminOrigin`.
     *
     * Parameters: era and indices of the slashes for that era to kill.
     */
    cancel_deferred_slash: TxDescriptor<Anonymize<I3h6murn8bd4v5>>;
    /**
     * Pay out next page of the stakers behind a validator for the given era.
     *
     * - `validator_stash` is the stash account of the validator.
     * - `era` may be any era between `[current_era - history_depth; current_era]`.
     *
     * The origin of this call must be _Signed_. Any account can call this function, even if
     * it is not one of the stakers.
     *
     * The reward payout could be paged in case there are too many nominators backing the
     * `validator_stash`. This call will payout unpaid pages in an ascending order. To claim a
     * specific page, use `payout_stakers_by_page`.`
     *
     * If all pages are claimed, it returns an error `InvalidPage`.
     */
    payout_stakers: TxDescriptor<Anonymize<I6k6jf8ncesuu3>>;
    /**
     * Rebond a portion of the stash scheduled to be unlocked.
     *
     * The dispatch origin must be signed by the controller.
     *
     * ## Complexity
     * - Time complexity: O(L), where L is unlocking chunks
     * - Bounded by `MaxUnlockingChunks`.
     */
    rebond: TxDescriptor<Anonymize<Ie5v6njpckr05b>>;
    /**
     * Remove all data structures concerning a staker/stash once it is at a state where it can
     * be considered `dust` in the staking system. The requirements are:
     *
     * 1. the `total_balance` of the stash is below existential deposit.
     * 2. or, the `ledger.total` of the stash is below existential deposit.
     * 3. or, existential deposit is zero and either `total_balance` or `ledger.total` is zero.
     *
     * The former can happen in cases like a slash; the latter when a fully unbonded account
     * is still receiving staking rewards in `RewardDestination::Staked`.
     *
     * It can be called by anyone, as long as `stash` meets the above requirements.
     *
     * Refunds the transaction fees upon successful execution.
     *
     * ## Parameters
     *
     * - `num_slashing_spans`: Refer to comments on [`Call::withdraw_unbonded`] for more
     * details.
     */
    reap_stash: TxDescriptor<Anonymize<Ie5vbnd9198quk>>;
    /**
     * Remove the given nominations from the calling validator.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
     *
     * - `who`: A list of nominator stash accounts who are nominating this validator which
     * should no longer be nominating this validator.
     *
     * Note: Making this call only makes sense if you first set the validator preferences to
     * block any further nominations.
     */
    kick: TxDescriptor<Anonymize<I3qhk481i120pk>>;
    /**
     * Update the various staking configurations .
     *
     * * `min_nominator_bond`: The minimum active bond needed to be a nominator.
     * * `min_validator_bond`: The minimum active bond needed to be a validator.
     * * `max_nominator_count`: The max number of users who can be a nominator at once. When
     * set to `None`, no limit is enforced.
     * * `max_validator_count`: The max number of users who can be a validator at once. When
     * set to `None`, no limit is enforced.
     * * `chill_threshold`: The ratio of `max_nominator_count` or `max_validator_count` which
     * should be filled in order for the `chill_other` transaction to work.
     * * `min_commission`: The minimum amount of commission that each validators must maintain.
     * This is checked only upon calling `validate`. Existing validators are not affected.
     *
     * RuntimeOrigin must be Root to call this function.
     *
     * NOTE: Existing nominators and validators will not be affected by this update.
     * to kick people under the new limits, `chill_other` should be called.
     */
    set_staking_configs: TxDescriptor<Anonymize<If1qr0kbbl298c>>;
    /**
     * Declare a `controller` to stop participating as either a validator or nominator.
     *
     * Effects will be felt at the beginning of the next era.
     *
     * The dispatch origin for this call must be _Signed_, but can be called by anyone.
     *
     * If the caller is the same as the controller being targeted, then no further checks are
     * enforced, and this function behaves just like `chill`.
     *
     * If the caller is different than the controller being targeted, the following conditions
     * must be met:
     *
     * * `controller` must belong to a nominator who has become non-decodable,
     *
     * Or:
     *
     * * A `ChillThreshold` must be set and checked which defines how close to the max
     * nominators or validators we must reach before users can start chilling one-another.
     * * A `MaxNominatorCount` and `MaxValidatorCount` must be set which is used to determine
     * how close we are to the threshold.
     * * A `MinNominatorBond` and `MinValidatorBond` must be set and checked, which determines
     * if this is a person that should be chilled because they have not met the threshold
     * bond required.
     *
     * This can be helpful if bond requirements are updated, and we need to remove old users
     * who do not satisfy these requirements.
     */
    chill_other: TxDescriptor<Anonymize<Idl3umm12u5pa>>;
    /**
     * Force a validator to have at least the minimum commission. This will not affect a
     * validator who already has a commission greater than or equal to the minimum. Any account
     * can call this.
     */
    force_apply_min_commission: TxDescriptor<Anonymize<I5ont0141q9ss5>>;
    /**
     * Sets the minimum amount of commission that each validators must maintain.
     *
     * This call has lower privilege requirements than `set_staking_config` and can be called
     * by the `T::AdminOrigin`. Root can always call this.
     */
    set_min_commission: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Pay out a page of the stakers behind a validator for the given era and page.
     *
     * - `validator_stash` is the stash account of the validator.
     * - `era` may be any era between `[current_era - history_depth; current_era]`.
     * - `page` is the page index of nominators to pay out with value between 0 and
     * `num_nominators / T::MaxExposurePageSize`.
     *
     * The origin of this call must be _Signed_. Any account can call this function, even if
     * it is not one of the stakers.
     *
     * If a validator has more than [`Config::MaxExposurePageSize`] nominators backing
     * them, then the list of nominators is paged, with each page being capped at
     * [`Config::MaxExposurePageSize`.] If a validator has more than one page of nominators,
     * the call needs to be made for each page separately in order for all the nominators
     * backing a validator to receive the reward. The nominators are not sorted across pages
     * and so it should not be assumed the highest staker would be on the topmost page and vice
     * versa. If rewards are not claimed in [`Config::HistoryDepth`] eras, they are lost.
     */
    payout_stakers_by_page: TxDescriptor<Anonymize<Ie6j49utvii126>>;
    /**
     * Migrates an account's `RewardDestination::Controller` to
     * `RewardDestination::Account(controller)`.
     *
     * Effects will be felt instantly (as soon as this function is completed successfully).
     *
     * This will waive the transaction fee if the `payee` is successfully migrated.
     */
    update_payee: TxDescriptor<Anonymize<I3v6ks33uluhnj>>;
    /**
     * Updates a batch of controller accounts to their corresponding stash account if they are
     * not the same. Ignores any controller accounts that do not exist, and does not operate if
     * the stash and controller are already the same.
     *
     * Effects will be felt instantly (as soon as this function is completed successfully).
     *
     * The dispatch origin must be `T::AdminOrigin`.
     */
    deprecate_controller_batch: TxDescriptor<Anonymize<I3kiiim1cds68i>>;
    /**
     * Restores the state of a ledger which is in an inconsistent state.
     *
     * The requirements to restore a ledger are the following:
     * * The stash is bonded; or
     * * The stash is not bonded but it has a staking lock left behind; or
     * * If the stash has an associated ledger and its state is inconsistent; or
     * * If the ledger is not corrupted *but* its staking lock is out of sync.
     *
     * The `maybe_*` input parameters will overwrite the corresponding data and metadata of the
     * ledger associated with the stash. If the input parameters are not set, the ledger will
     * be reset values from on-chain state.
     */
    restore_ledger: TxDescriptor<Anonymize<I4k60mkh2r6jjg>>;
    /**
     * Adjusts the staking ledger by withdrawing any excess staked amount.
     *
     * This function corrects cases where a user's recorded stake in the ledger
     * exceeds their actual staked funds. This situation can arise due to cases such as
     * external slashing by another pallet, leading to an inconsistency between the ledger
     * and the actual stake.
     */
    withdraw_overstake: TxDescriptor<Anonymize<Idl3umm12u5pa>>;
  };
  Session: {
    /**
     * Sets the session key(s) of the function caller to `keys`.
     * Allows an account to set its session key prior to becoming a validator.
     * This doesn't take effect until the next session.
     *
     * The dispatch origin of this function must be signed.
     *
     * ## Complexity
     * - `O(1)`. Actual cost depends on the number of length of `T::Keys::key_ids()` which is
     * fixed.
     */
    set_keys: TxDescriptor<Anonymize<I5oi8saufice6j>>;
    /**
     * Removes any session key(s) of the function caller.
     *
     * This doesn't take effect until the next session.
     *
     * The dispatch origin of this function must be Signed and the account must be either be
     * convertible to a validator ID using the chain's typical addressing system (this usually
     * means being a controller account) or directly convertible into a validator ID (which
     * usually means being a stash account).
     *
     * ## Complexity
     * - `O(1)` in number of key types. Actual cost depends on the number of length of
     * `T::Keys::key_ids()` which is fixed.
     */
    purge_keys: TxDescriptor<undefined>;
  };
  Grandpa: {
    /**
     * Report voter equivocation/misbehavior. This method will verify the
     * equivocation proof and validate the given key ownership proof
     * against the extracted offender. If both are valid, the offence
     * will be reported.
     */
    report_equivocation: TxDescriptor<Anonymize<I7ne83r38c2sqq>>;
    /**
     * Report voter equivocation/misbehavior. This method will verify the
     * equivocation proof and validate the given key ownership proof
     * against the extracted offender. If both are valid, the offence
     * will be reported.
     *
     * This extrinsic must be called unsigned and it is expected that only
     * block authors will call it (validated in `ValidateUnsigned`), as such
     * if the block author is defined it will be defined as the equivocation
     * reporter.
     */
    report_equivocation_unsigned: TxDescriptor<Anonymize<I7ne83r38c2sqq>>;
    /**
     * Note that the current authority set of the GRANDPA finality gadget has stalled.
     *
     * This will trigger a forced authority set change at the beginning of the next session, to
     * be enacted `delay` blocks after that. The `delay` should be high enough to safely assume
     * that the block signalling the forced change will not be re-orged e.g. 1000 blocks.
     * The block production rate (which may be slowed down because of finality lagging) should
     * be taken into account when choosing the `delay`. The GRANDPA voters based on the new
     * authority will start voting on top of `best_finalized_block_number` for new finalized
     * blocks. `best_finalized_block_number` should be the highest of the latest finalized
     * block of all validators of the new authority set.
     *
     * Only callable by root.
     */
    note_stalled: TxDescriptor<Anonymize<I2hviml3snvhhn>>;
  };
  Treasury: {
    /**
     * Propose and approve a spend of treasury funds.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::SpendOrigin`] with the `Success` value being at least `amount`.
     *
     * ### Details
     * NOTE: For record-keeping purposes, the proposer is deemed to be equivalent to the
     * beneficiary.
     *
     * ### Parameters
     * - `amount`: The amount to be transferred from the treasury to the `beneficiary`.
     * - `beneficiary`: The destination account for the transfer.
     *
     * ## Events
     *
     * Emits [`Event::SpendApproved`] if successful.
     */
    spend_local: TxDescriptor<Anonymize<Icnrv1mfbd3in1>>;
    /**
     * Force a previously approved proposal to be removed from the approval queue.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::RejectOrigin`].
     *
     * ## Details
     *
     * The original deposit will no longer be returned.
     *
     * ### Parameters
     * - `proposal_id`: The index of a proposal
     *
     * ### Complexity
     * - O(A) where `A` is the number of approvals
     *
     * ### Errors
     * - [`Error::ProposalNotApproved`]: The `proposal_id` supplied was not found in the
     * approval queue, i.e., the proposal has not been approved. This could also mean the
     * proposal does not exist altogether, thus there is no way it would have been approved
     * in the first place.
     */
    remove_approval: TxDescriptor<Anonymize<Icm9m0qeemu66d>>;
    /**
     * Propose and approve a spend of treasury funds.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::SpendOrigin`] with the `Success` value being at least
     * `amount` of `asset_kind` in the native asset. The amount of `asset_kind` is converted
     * for assertion using the [`Config::BalanceConverter`].
     *
     * ## Details
     *
     * Create an approved spend for transferring a specific `amount` of `asset_kind` to a
     * designated beneficiary. The spend must be claimed using the `payout` dispatchable within
     * the [`Config::PayoutPeriod`].
     *
     * ### Parameters
     * - `asset_kind`: An indicator of the specific asset class to be spent.
     * - `amount`: The amount to be transferred from the treasury to the `beneficiary`.
     * - `beneficiary`: The beneficiary of the spend.
     * - `valid_from`: The block number from which the spend can be claimed. It can refer to
     * the past if the resulting spend has not yet expired according to the
     * [`Config::PayoutPeriod`]. If `None`, the spend can be claimed immediately after
     * approval.
     *
     * ## Events
     *
     * Emits [`Event::AssetSpendApproved`] if successful.
     */
    spend: TxDescriptor<Anonymize<Ibv74ul0c0qf0f>>;
    /**
     * Claim a spend.
     *
     * ## Dispatch Origin
     *
     * Must be signed
     *
     * ## Details
     *
     * Spends must be claimed within some temporal bounds. A spend may be claimed within one
     * [`Config::PayoutPeriod`] from the `valid_from` block.
     * In case of a payout failure, the spend status must be updated with the `check_status`
     * dispatchable before retrying with the current function.
     *
     * ### Parameters
     * - `index`: The spend index.
     *
     * ## Events
     *
     * Emits [`Event::Paid`] if successful.
     */
    payout: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Check the status of the spend and remove it from the storage if processed.
     *
     * ## Dispatch Origin
     *
     * Must be signed.
     *
     * ## Details
     *
     * The status check is a prerequisite for retrying a failed payout.
     * If a spend has either succeeded or expired, it is removed from the storage by this
     * function. In such instances, transaction fees are refunded.
     *
     * ### Parameters
     * - `index`: The spend index.
     *
     * ## Events
     *
     * Emits [`Event::PaymentFailed`] if the spend payout has failed.
     * Emits [`Event::SpendProcessed`] if the spend payout has succeed.
     */
    check_status: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Void previously approved spend.
     *
     * ## Dispatch Origin
     *
     * Must be [`Config::RejectOrigin`].
     *
     * ## Details
     *
     * A spend void is only possible if the payout has not been attempted yet.
     *
     * ### Parameters
     * - `index`: The spend index.
     *
     * ## Events
     *
     * Emits [`Event::AssetSpendVoided`] if successful.
     */
    void_spend: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
  };
  ConvictionVoting: {
    /**
     * Vote in a poll. If `vote.is_aye()`, the vote is to enact the proposal;
     * otherwise it is a vote to keep the status quo.
     *
     * The dispatch origin of this call must be _Signed_.
     *
     * - `poll_index`: The index of the poll to vote for.
     * - `vote`: The vote configuration.
     *
     * Weight: `O(R)` where R is the number of polls the voter has voted on.
     */
    vote: TxDescriptor<Anonymize<Idnsr2pndm36h0>>;
    /**
     * Delegate the voting power (with some given conviction) of the sending account for a
     * particular class of polls.
     *
     * The balance delegated is locked for as long as it's delegated, and thereafter for the
     * time appropriate for the conviction's lock period.
     *
     * The dispatch origin of this call must be _Signed_, and the signing account must either:
     * - be delegating already; or
     * - have no voting activity (if there is, then it will need to be removed through
     * `remove_vote`).
     *
     * - `to`: The account whose voting the `target` account's voting power will follow.
     * - `class`: The class of polls to delegate. To delegate multiple classes, multiple calls
     * to this function are required.
     * - `conviction`: The conviction that will be attached to the delegated votes. When the
     * account is undelegated, the funds will be locked for the corresponding period.
     * - `balance`: The amount of the account's balance to be used in delegating. This must not
     * be more than the account's current balance.
     *
     * Emits `Delegated`.
     *
     * Weight: `O(R)` where R is the number of polls the voter delegating to has
     * voted on. Weight is initially charged as if maximum votes, but is refunded later.
     */
    delegate: TxDescriptor<Anonymize<Ia1pvdcbhuqf8m>>;
    /**
     * Undelegate the voting power of the sending account for a particular class of polls.
     *
     * Tokens may be unlocked following once an amount of time consistent with the lock period
     * of the conviction with which the delegation was issued has passed.
     *
     * The dispatch origin of this call must be _Signed_ and the signing account must be
     * currently delegating.
     *
     * - `class`: The class of polls to remove the delegation from.
     *
     * Emits `Undelegated`.
     *
     * Weight: `O(R)` where R is the number of polls the voter delegating to has
     * voted on. Weight is initially charged as if maximum votes, but is refunded later.
     */
    undelegate: TxDescriptor<Anonymize<I8steo882k7qns>>;
    /**
     * Remove the lock caused by prior voting/delegating which has expired within a particular
     * class.
     *
     * The dispatch origin of this call must be _Signed_.
     *
     * - `class`: The class of polls to unlock.
     * - `target`: The account to remove the lock on.
     *
     * Weight: `O(R)` with R number of vote of target.
     */
    unlock: TxDescriptor<Anonymize<I4pa4q37gj6fua>>;
    /**
     * Remove a vote for a poll.
     *
     * If:
     * - the poll was cancelled, or
     * - the poll is ongoing, or
     * - the poll has ended such that
     * - the vote of the account was in opposition to the result; or
     * - there was no conviction to the account's vote; or
     * - the account made a split vote
     * ...then the vote is removed cleanly and a following call to `unlock` may result in more
     * funds being available.
     *
     * If, however, the poll has ended and:
     * - it finished corresponding to the vote of the account, and
     * - the account made a standard vote with conviction, and
     * - the lock period of the conviction is not over
     * ...then the lock will be aggregated into the overall account's lock, which may involve
     * *overlocking* (where the two locks are combined into a single lock that is the maximum
     * of both the amount locked and the time is it locked for).
     *
     * The dispatch origin of this call must be _Signed_, and the signer must have a vote
     * registered for poll `index`.
     *
     * - `index`: The index of poll of the vote to be removed.
     * - `class`: Optional parameter, if given it indicates the class of the poll. For polls
     * which have finished or are cancelled, this must be `Some`.
     *
     * Weight: `O(R + log R)` where R is the number of polls that `target` has voted on.
     * Weight is calculated for the maximum number of vote.
     */
    remove_vote: TxDescriptor<Anonymize<I5f178ab6b89t3>>;
    /**
     * Remove a vote for a poll.
     *
     * If the `target` is equal to the signer, then this function is exactly equivalent to
     * `remove_vote`. If not equal to the signer, then the vote must have expired,
     * either because the poll was cancelled, because the voter lost the poll or
     * because the conviction period is over.
     *
     * The dispatch origin of this call must be _Signed_.
     *
     * - `target`: The account of the vote to be removed; this account must have voted for poll
     * `index`.
     * - `index`: The index of poll of the vote to be removed.
     * - `class`: The class of the poll.
     *
     * Weight: `O(R + log R)` where R is the number of polls that `target` has voted on.
     * Weight is calculated for the maximum number of vote.
     */
    remove_other_vote: TxDescriptor<Anonymize<I4nakhtbsk3c5s>>;
  };
  Referenda: {
    /**
     * Propose a referendum on a privileged action.
     *
     * - `origin`: must be `SubmitOrigin` and the account must have `SubmissionDeposit` funds
     * available.
     * - `proposal_origin`: The origin from which the proposal should be executed.
     * - `proposal`: The proposal.
     * - `enactment_moment`: The moment that the proposal should be enacted.
     *
     * Emits `Submitted`.
     */
    submit: TxDescriptor<Anonymize<I4dvjo4haia091>>;
    /**
     * Post the Decision Deposit for a referendum.
     *
     * - `origin`: must be `Signed` and the account must have funds available for the
     * referendum's track's Decision Deposit.
     * - `index`: The index of the submitted referendum whose Decision Deposit is yet to be
     * posted.
     *
     * Emits `DecisionDepositPlaced`.
     */
    place_decision_deposit: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Refund the Decision Deposit for a closed referendum back to the depositor.
     *
     * - `origin`: must be `Signed` or `Root`.
     * - `index`: The index of a closed referendum whose Decision Deposit has not yet been
     * refunded.
     *
     * Emits `DecisionDepositRefunded`.
     */
    refund_decision_deposit: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Cancel an ongoing referendum.
     *
     * - `origin`: must be the `CancelOrigin`.
     * - `index`: The index of the referendum to be cancelled.
     *
     * Emits `Cancelled`.
     */
    cancel: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Cancel an ongoing referendum and slash the deposits.
     *
     * - `origin`: must be the `KillOrigin`.
     * - `index`: The index of the referendum to be cancelled.
     *
     * Emits `Killed` and `DepositSlashed`.
     */
    kill: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Advance a referendum onto its next logical state. Only used internally.
     *
     * - `origin`: must be `Root`.
     * - `index`: the referendum to be advanced.
     */
    nudge_referendum: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Advance a track onto its next logical state. Only used internally.
     *
     * - `origin`: must be `Root`.
     * - `track`: the track to be advanced.
     *
     * Action item for when there is now one fewer referendum in the deciding phase and the
     * `DecidingCount` is not yet updated. This means that we should either:
     * - begin deciding another referendum (and leave `DecidingCount` alone); or
     * - decrement `DecidingCount`.
     */
    one_fewer_deciding: TxDescriptor<Anonymize<Icbio0e1f0034b>>;
    /**
     * Refund the Submission Deposit for a closed referendum back to the depositor.
     *
     * - `origin`: must be `Signed` or `Root`.
     * - `index`: The index of a closed referendum whose Submission Deposit has not yet been
     * refunded.
     *
     * Emits `SubmissionDepositRefunded`.
     */
    refund_submission_deposit: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Set or clear metadata of a referendum.
     *
     * Parameters:
     * - `origin`: Must be `Signed` by a creator of a referendum or by anyone to clear a
     * metadata of a finished referendum.
     * - `index`:  The index of a referendum to set or clear metadata for.
     * - `maybe_hash`: The hash of an on-chain stored preimage. `None` to clear a metadata.
     */
    set_metadata: TxDescriptor<Anonymize<I8c0vkqjjipnuj>>;
  };
  FellowshipCollective: {
    /**
     * Introduce a new member.
     *
     * - `origin`: Must be the `AddOrigin`.
     * - `who`: Account of non-member which will become a member.
     *
     * Weight: `O(1)`
     */
    add_member: TxDescriptor<Anonymize<I59bngqm85b22v>>;
    /**
     * Increment the rank of an existing member by one.
     *
     * - `origin`: Must be the `PromoteOrigin`.
     * - `who`: Account of existing member.
     *
     * Weight: `O(1)`
     */
    promote_member: TxDescriptor<Anonymize<I59bngqm85b22v>>;
    /**
     * Decrement the rank of an existing member by one. If the member is already at rank zero,
     * then they are removed entirely.
     *
     * - `origin`: Must be the `DemoteOrigin`.
     * - `who`: Account of existing member of rank greater than zero.
     *
     * Weight: `O(1)`, less if the member's index is highest in its rank.
     */
    demote_member: TxDescriptor<Anonymize<I59bngqm85b22v>>;
    /**
     * Remove the member entirely.
     *
     * - `origin`: Must be the `RemoveOrigin`.
     * - `who`: Account of existing member of rank greater than zero.
     * - `min_rank`: The rank of the member or greater.
     *
     * Weight: `O(min_rank)`.
     */
    remove_member: TxDescriptor<Anonymize<I3amdclkdfaipk>>;
    /**
     * Add an aye or nay vote for the sender to the given proposal.
     *
     * - `origin`: Must be `Signed` by a member account.
     * - `poll`: Index of a poll which is ongoing.
     * - `aye`: `true` if the vote is to approve the proposal, `false` otherwise.
     *
     * Transaction fees are be waived if the member is voting on any particular proposal
     * for the first time and the call is successful. Subsequent vote changes will charge a
     * fee.
     *
     * Weight: `O(1)`, less if there was no previous vote on the poll by the member.
     */
    vote: TxDescriptor<Anonymize<I8bvk21lpmah75>>;
    /**
     * Remove votes from the given poll. It must have ended.
     *
     * - `origin`: Must be `Signed` by any account.
     * - `poll_index`: Index of a poll which is completed and for which votes continue to
     * exist.
     * - `max`: Maximum number of vote items from remove in this call.
     *
     * Transaction fees are waived if the operation is successful.
     *
     * Weight `O(max)` (less if there are fewer items to remove than `max`).
     */
    cleanup_poll: TxDescriptor<Anonymize<I449n3riv6jbum>>;
    /**
     * Exchanges a member with a new account and the same existing rank.
     *
     * - `origin`: Must be the `ExchangeOrigin`.
     * - `who`: Account of existing member of rank greater than zero to be exchanged.
     * - `new_who`: New Account of existing member of rank greater than zero to exchanged to.
     */
    exchange_member: TxDescriptor<Anonymize<I9a7qiue67urvk>>;
  };
  FellowshipReferenda: {
    /**
     * Propose a referendum on a privileged action.
     *
     * - `origin`: must be `SubmitOrigin` and the account must have `SubmissionDeposit` funds
     * available.
     * - `proposal_origin`: The origin from which the proposal should be executed.
     * - `proposal`: The proposal.
     * - `enactment_moment`: The moment that the proposal should be enacted.
     *
     * Emits `Submitted`.
     */
    submit: TxDescriptor<Anonymize<I4dvjo4haia091>>;
    /**
     * Post the Decision Deposit for a referendum.
     *
     * - `origin`: must be `Signed` and the account must have funds available for the
     * referendum's track's Decision Deposit.
     * - `index`: The index of the submitted referendum whose Decision Deposit is yet to be
     * posted.
     *
     * Emits `DecisionDepositPlaced`.
     */
    place_decision_deposit: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Refund the Decision Deposit for a closed referendum back to the depositor.
     *
     * - `origin`: must be `Signed` or `Root`.
     * - `index`: The index of a closed referendum whose Decision Deposit has not yet been
     * refunded.
     *
     * Emits `DecisionDepositRefunded`.
     */
    refund_decision_deposit: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Cancel an ongoing referendum.
     *
     * - `origin`: must be the `CancelOrigin`.
     * - `index`: The index of the referendum to be cancelled.
     *
     * Emits `Cancelled`.
     */
    cancel: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Cancel an ongoing referendum and slash the deposits.
     *
     * - `origin`: must be the `KillOrigin`.
     * - `index`: The index of the referendum to be cancelled.
     *
     * Emits `Killed` and `DepositSlashed`.
     */
    kill: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Advance a referendum onto its next logical state. Only used internally.
     *
     * - `origin`: must be `Root`.
     * - `index`: the referendum to be advanced.
     */
    nudge_referendum: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Advance a track onto its next logical state. Only used internally.
     *
     * - `origin`: must be `Root`.
     * - `track`: the track to be advanced.
     *
     * Action item for when there is now one fewer referendum in the deciding phase and the
     * `DecidingCount` is not yet updated. This means that we should either:
     * - begin deciding another referendum (and leave `DecidingCount` alone); or
     * - decrement `DecidingCount`.
     */
    one_fewer_deciding: TxDescriptor<Anonymize<Icbio0e1f0034b>>;
    /**
     * Refund the Submission Deposit for a closed referendum back to the depositor.
     *
     * - `origin`: must be `Signed` or `Root`.
     * - `index`: The index of a closed referendum whose Submission Deposit has not yet been
     * refunded.
     *
     * Emits `SubmissionDepositRefunded`.
     */
    refund_submission_deposit: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Set or clear metadata of a referendum.
     *
     * Parameters:
     * - `origin`: Must be `Signed` by a creator of a referendum or by anyone to clear a
     * metadata of a finished referendum.
     * - `index`:  The index of a referendum to set or clear metadata for.
     * - `maybe_hash`: The hash of an on-chain stored preimage. `None` to clear a metadata.
     */
    set_metadata: TxDescriptor<Anonymize<I8c0vkqjjipnuj>>;
  };
  Whitelist: {
    /**
        
         */
    whitelist_call: TxDescriptor<Anonymize<I1adbcfi5uc62r>>;
    /**
        
         */
    remove_whitelisted_call: TxDescriptor<Anonymize<I1adbcfi5uc62r>>;
    /**
        
         */
    dispatch_whitelisted_call: TxDescriptor<Anonymize<Ibf6ucefn8fh49>>;
    /**
        
         */
    dispatch_whitelisted_call_with_preimage: TxDescriptor<Anonymize<I1r6n193nfcjlk>>;
  };
  Parameters: {
    /**
     * Set the value of a parameter.
     *
     * The dispatch origin of this call must be `AdminOrigin` for the given `key`. Values be
     * deleted by setting them to `None`.
     */
    set_parameter: TxDescriptor<Anonymize<I65ea24ohl89b2>>;
  };
  Claims: {
    /**
     * Make a claim to collect your DOTs.
     *
     * The dispatch origin for this call must be _None_.
     *
     * Unsigned Validation:
     * A call to claim is deemed valid if the signature provided matches
     * the expected signed message of:
     *
     * > Ethereum Signed Message:
     * > (configured prefix string)(address)
     *
     * and `address` matches the `dest` account.
     *
     * Parameters:
     * - `dest`: The destination account to payout the claim.
     * - `ethereum_signature`: The signature of an ethereum signed message matching the format
     * described above.
     *
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * Weight includes logic to validate unsigned `claim` call.
     *
     * Total Complexity: O(1)
     * </weight>
     */
    claim: TxDescriptor<Anonymize<I6uag8j5aql8q>>;
    /**
     * Mint a new claim to collect DOTs.
     *
     * The dispatch origin for this call must be _Root_.
     *
     * Parameters:
     * - `who`: The Ethereum address allowed to collect this claim.
     * - `value`: The number of DOTs that will be claimed.
     * - `vesting_schedule`: An optional vesting schedule for these DOTs.
     *
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * We assume worst case that both vesting and statement is being inserted.
     *
     * Total Complexity: O(1)
     * </weight>
     */
    mint_claim: TxDescriptor<Anonymize<Isq3k9rh2c0l4>>;
    /**
     * Make a claim to collect your DOTs by signing a statement.
     *
     * The dispatch origin for this call must be _None_.
     *
     * Unsigned Validation:
     * A call to `claim_attest` is deemed valid if the signature provided matches
     * the expected signed message of:
     *
     * > Ethereum Signed Message:
     * > (configured prefix string)(address)(statement)
     *
     * and `address` matches the `dest` account; the `statement` must match that which is
     * expected according to your purchase arrangement.
     *
     * Parameters:
     * - `dest`: The destination account to payout the claim.
     * - `ethereum_signature`: The signature of an ethereum signed message matching the format
     * described above.
     * - `statement`: The identity of the statement which is being attested to in the
     * signature.
     *
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * Weight includes logic to validate unsigned `claim_attest` call.
     *
     * Total Complexity: O(1)
     * </weight>
     */
    claim_attest: TxDescriptor<Anonymize<I1dqiovk0tpoah>>;
    /**
     * Attest to a statement, needed to finalize the claims process.
     *
     * WARNING: Insecure unless your chain includes `PrevalidateAttests` as a
     * `SignedExtension`.
     *
     * Unsigned Validation:
     * A call to attest is deemed valid if the sender has a `Preclaim` registered
     * and provides a `statement` which is expected for the account.
     *
     * Parameters:
     * - `statement`: The identity of the statement which is being attested to in the
     * signature.
     *
     * <weight>
     * The weight of this call is invariant over the input parameters.
     * Weight includes logic to do pre-validation on `attest` call.
     *
     * Total Complexity: O(1)
     * </weight>
     */
    attest: TxDescriptor<Anonymize<I1ntko0oih7v1a>>;
    /**
        
         */
    move_claim: TxDescriptor<Anonymize<I2tf5qmg09624f>>;
  };
  Utility: {
    /**
     * Send a batch of dispatch calls.
     *
     * May be called from any origin except `None`.
     *
     * - `calls`: The calls to be dispatched from the same origin. The number of call must not
     * exceed the constant: `batched_calls_limit` (available in constant metadata).
     *
     * If origin is root then the calls are dispatched without checking origin filter. (This
     * includes bypassing `frame_system::Config::BaseCallFilter`).
     *
     * ## Complexity
     * - O(C) where C is the number of calls to be batched.
     *
     * This will return `Ok` in all circumstances. To determine the success of the batch, an
     * event is deposited. If a call failed and the batch was interrupted, then the
     * `BatchInterrupted` event is deposited, along with the number of successful calls made
     * and the error of the failed call. If all were successful, then the `BatchCompleted`
     * event is deposited.
     */
    batch: TxDescriptor<Anonymize<Igpdat480l5fi>>;
    /**
     * Send a call through an indexed pseudonym of the sender.
     *
     * Filter from origin are passed along. The call will be dispatched with an origin which
     * use the same filter as the origin of this call.
     *
     * NOTE: If you need to ensure that any account-based filtering is not honored (i.e.
     * because you expect `proxy` to have been used prior in the call stack and you do not want
     * the call restrictions to apply to any sub-accounts), then use `as_multi_threshold_1`
     * in the Multisig pallet instead.
     *
     * NOTE: Prior to version *12, this was called `as_limited_sub`.
     *
     * The dispatch origin for this call must be _Signed_.
     */
    as_derivative: TxDescriptor<Anonymize<I1pca80gmdvp3r>>;
    /**
     * Send a batch of dispatch calls and atomically execute them.
     * The whole transaction will rollback and fail if any of the calls failed.
     *
     * May be called from any origin except `None`.
     *
     * - `calls`: The calls to be dispatched from the same origin. The number of call must not
     * exceed the constant: `batched_calls_limit` (available in constant metadata).
     *
     * If origin is root then the calls are dispatched without checking origin filter. (This
     * includes bypassing `frame_system::Config::BaseCallFilter`).
     *
     * ## Complexity
     * - O(C) where C is the number of calls to be batched.
     */
    batch_all: TxDescriptor<Anonymize<Igpdat480l5fi>>;
    /**
     * Dispatches a function call with a provided origin.
     *
     * The dispatch origin for this call must be _Root_.
     *
     * ## Complexity
     * - O(1).
     */
    dispatch_as: TxDescriptor<Anonymize<Ifb92raqltbcv9>>;
    /**
     * Send a batch of dispatch calls.
     * Unlike `batch`, it allows errors and won't interrupt.
     *
     * May be called from any origin except `None`.
     *
     * - `calls`: The calls to be dispatched from the same origin. The number of call must not
     * exceed the constant: `batched_calls_limit` (available in constant metadata).
     *
     * If origin is root then the calls are dispatch without checking origin filter. (This
     * includes bypassing `frame_system::Config::BaseCallFilter`).
     *
     * ## Complexity
     * - O(C) where C is the number of calls to be batched.
     */
    force_batch: TxDescriptor<Anonymize<Igpdat480l5fi>>;
    /**
     * Dispatch a function call with a specified weight.
     *
     * This function does not check the weight of the call, and instead allows the
     * Root origin to specify the weight of the call.
     *
     * The dispatch origin for this call must be _Root_.
     */
    with_weight: TxDescriptor<Anonymize<I5v36mpdeqskbu>>;
  };
  Society: {
    /**
     * A user outside of the society can make a bid for entry.
     *
     * Payment: The group's Candidate Deposit will be reserved for making a bid. It is returned
     * when the bid becomes a member, or if the bid calls `unbid`.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `value`: A one time payment the bid would like to receive when joining the society.
     */
    bid: TxDescriptor<Anonymize<Ie5v6njpckr05b>>;
    /**
     * A bidder can remove their bid for entry into society.
     * By doing so, they will have their candidate deposit returned or
     * they will unvouch their voucher.
     *
     * Payment: The bid deposit is unreserved if the user made a bid.
     *
     * The dispatch origin for this call must be _Signed_ and a bidder.
     */
    unbid: TxDescriptor<undefined>;
    /**
     * As a member, vouch for someone to join society by placing a bid on their behalf.
     *
     * There is no deposit required to vouch for a new bid, but a member can only vouch for
     * one bid at a time. If the bid becomes a suspended candidate and ultimately rejected by
     * the suspension judgement origin, the member will be banned from vouching again.
     *
     * As a vouching member, you can claim a tip if the candidate is accepted. This tip will
     * be paid as a portion of the reward the member will receive for joining the society.
     *
     * The dispatch origin for this call must be _Signed_ and a member.
     *
     * Parameters:
     * - `who`: The user who you would like to vouch for.
     * - `value`: The total reward to be paid between you and the candidate if they become
     * a member in the society.
     * - `tip`: Your cut of the total `value` payout when the candidate is inducted into
     * the society. Tips larger than `value` will be saturated upon payout.
     */
    vouch: TxDescriptor<Anonymize<Ibvkbvbkttt0k5>>;
    /**
     * As a vouching member, unvouch a bid. This only works while vouched user is
     * only a bidder (and not a candidate).
     *
     * The dispatch origin for this call must be _Signed_ and a vouching member.
     *
     * Parameters:
     * - `pos`: Position in the `Bids` vector of the bid who should be unvouched.
     */
    unvouch: TxDescriptor<undefined>;
    /**
     * As a member, vote on a candidate.
     *
     * The dispatch origin for this call must be _Signed_ and a member.
     *
     * Parameters:
     * - `candidate`: The candidate that the member would like to bid on.
     * - `approve`: A boolean which says if the candidate should be approved (`true`) or
     * rejected (`false`).
     */
    vote: TxDescriptor<Anonymize<I8i12uisk6j7l>>;
    /**
     * As a member, vote on the defender.
     *
     * The dispatch origin for this call must be _Signed_ and a member.
     *
     * Parameters:
     * - `approve`: A boolean which says if the candidate should be
     * approved (`true`) or rejected (`false`).
     */
    defender_vote: TxDescriptor<Anonymize<I26anifrfnljoi>>;
    /**
     * Transfer the first matured payout for the sender and remove it from the records.
     *
     * NOTE: This extrinsic needs to be called multiple times to claim multiple matured
     * payouts.
     *
     * Payment: The member will receive a payment equal to their first matured
     * payout to their free balance.
     *
     * The dispatch origin for this call must be _Signed_ and a member with
     * payouts remaining.
     */
    payout: TxDescriptor<undefined>;
    /**
     * Repay the payment previously given to the member with the signed origin, remove any
     * pending payments, and elevate them from rank 0 to rank 1.
     */
    waive_repay: TxDescriptor<Anonymize<I3qt1hgg4djhgb>>;
    /**
     * Found the society.
     *
     * This is done as a discrete action in order to allow for the
     * pallet to be included into a running chain and can only be done once.
     *
     * The dispatch origin for this call must be from the _FounderSetOrigin_.
     *
     * Parameters:
     * - `founder` - The first member and head of the newly founded society.
     * - `max_members` - The initial max number of members for the society.
     * - `max_intake` - The maximum number of candidates per intake period.
     * - `max_strikes`: The maximum number of strikes a member may get before they become
     * suspended and may only be reinstated by the founder.
     * - `candidate_deposit`: The deposit required to make a bid for membership of the group.
     * - `rules` - The rules of this society concerning membership.
     *
     * Complexity: O(1)
     */
    found_society: TxDescriptor<Anonymize<I6a6f85pb71ums>>;
    /**
     * Dissolve the society and remove all members.
     *
     * The dispatch origin for this call must be Signed, and the signing account must be both
     * the `Founder` and the `Head`. This implies that it may only be done when there is one
     * member.
     */
    dissolve: TxDescriptor<undefined>;
    /**
     * Allow suspension judgement origin to make judgement on a suspended member.
     *
     * If a suspended member is forgiven, we simply add them back as a member, not affecting
     * any of the existing storage items for that member.
     *
     * If a suspended member is rejected, remove all associated storage items, including
     * their payouts, and remove any vouched bids they currently have.
     *
     * The dispatch origin for this call must be Signed from the Founder.
     *
     * Parameters:
     * - `who` - The suspended member to be judged.
     * - `forgive` - A boolean representing whether the suspension judgement origin forgives
     * (`true`) or rejects (`false`) a suspended member.
     */
    judge_suspended_member: TxDescriptor<Anonymize<I96p6guspeq6t>>;
    /**
     * Change the maximum number of members in society and the maximum number of new candidates
     * in a single intake period.
     *
     * The dispatch origin for this call must be Signed by the Founder.
     *
     * Parameters:
     * - `max_members` - The maximum number of members for the society. This must be no less
     * than the current number of members.
     * - `max_intake` - The maximum number of candidates per intake period.
     * - `max_strikes`: The maximum number of strikes a member may get before they become
     * suspended and may only be reinstated by the founder.
     * - `candidate_deposit`: The deposit required to make a bid for membership of the group.
     */
    set_parameters: TxDescriptor<Anonymize<I9hkvi4k3kh916>>;
    /**
     * Punish the skeptic with a strike if they did not vote on a candidate. Callable by the
     * candidate.
     */
    punish_skeptic: TxDescriptor<undefined>;
    /**
     * Transform an approved candidate into a member. Callable only by the
     * the candidate, and only after the period for voting has ended.
     */
    claim_membership: TxDescriptor<undefined>;
    /**
     * Transform an approved candidate into a member. Callable only by the Signed origin of the
     * Founder, only after the period for voting has ended and only when the candidate is not
     * clearly rejected.
     */
    bestow_membership: TxDescriptor<Anonymize<I4b66js88p45m8>>;
    /**
     * Remove the candidate's application from the society. Callable only by the Signed origin
     * of the Founder, only after the period for voting has ended, and only when they do not
     * have a clear approval.
     *
     * Any bid deposit is lost and voucher is banned.
     */
    kick_candidate: TxDescriptor<Anonymize<I4b66js88p45m8>>;
    /**
     * Remove the candidate's application from the society. Callable only by the candidate.
     *
     * Any bid deposit is lost and voucher is banned.
     */
    resign_candidacy: TxDescriptor<undefined>;
    /**
     * Remove a `candidate`'s failed application from the society. Callable by any
     * signed origin but only at the end of the subsequent round and only for
     * a candidate with more rejections than approvals.
     *
     * The bid deposit is lost and the voucher is banned.
     */
    drop_candidate: TxDescriptor<Anonymize<I4b66js88p45m8>>;
    /**
     * Remove up to `max` stale votes for the given `candidate`.
     *
     * May be called by any Signed origin, but only after the candidate's candidacy is ended.
     */
    cleanup_candidacy: TxDescriptor<Anonymize<Ieh40op1lafir9>>;
    /**
     * Remove up to `max` stale votes for the defender in the given `challenge_round`.
     *
     * May be called by any Signed origin, but only after the challenge round is ended.
     */
    cleanup_challenge: TxDescriptor<Anonymize<Icjp7f9u9fno72>>;
  };
  Recovery: {
    /**
     * Send a call through a recovered account.
     *
     * The dispatch origin for this call must be _Signed_ and registered to
     * be able to make calls on behalf of the recovered account.
     *
     * Parameters:
     * - `account`: The recovered account you want to make a call on-behalf-of.
     * - `call`: The call you want to make with the recovered account.
     */
    as_recovered: TxDescriptor<Anonymize<I41h4m4lrp9r4e>>;
    /**
     * Allow ROOT to bypass the recovery process and set an a rescuer account
     * for a lost account directly.
     *
     * The dispatch origin for this call must be _ROOT_.
     *
     * Parameters:
     * - `lost`: The "lost account" to be recovered.
     * - `rescuer`: The "rescuer account" which can call as the lost account.
     */
    set_recovered: TxDescriptor<Anonymize<I7pqmhr25d3dqq>>;
    /**
     * Create a recovery configuration for your account. This makes your account recoverable.
     *
     * Payment: `ConfigDepositBase` + `FriendDepositFactor` * #_of_friends balance
     * will be reserved for storing the recovery configuration. This deposit is returned
     * in full when the user calls `remove_recovery`.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `friends`: A list of friends you trust to vouch for recovery attempts. Should be
     * ordered and contain no duplicate values.
     * - `threshold`: The number of friends that must vouch for a recovery attempt before the
     * account can be recovered. Should be less than or equal to the length of the list of
     * friends.
     * - `delay_period`: The number of blocks after a recovery attempt is initialized that
     * needs to pass before the account can be recovered.
     */
    create_recovery: TxDescriptor<Anonymize<I6s6ihmfj6j5qq>>;
    /**
     * Initiate the process for recovering a recoverable account.
     *
     * Payment: `RecoveryDeposit` balance will be reserved for initiating the
     * recovery process. This deposit will always be repatriated to the account
     * trying to be recovered. See `close_recovery`.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `account`: The lost account that you want to recover. This account needs to be
     * recoverable (i.e. have a recovery configuration).
     */
    initiate_recovery: TxDescriptor<Anonymize<Ic6cqd9g0t65v0>>;
    /**
     * Allow a "friend" of a recoverable account to vouch for an active recovery
     * process for that account.
     *
     * The dispatch origin for this call must be _Signed_ and must be a "friend"
     * for the recoverable account.
     *
     * Parameters:
     * - `lost`: The lost account that you want to recover.
     * - `rescuer`: The account trying to rescue the lost account that you want to vouch for.
     *
     * The combination of these two parameters must point to an active recovery
     * process.
     */
    vouch_recovery: TxDescriptor<Anonymize<I7pqmhr25d3dqq>>;
    /**
     * Allow a successful rescuer to claim their recovered account.
     *
     * The dispatch origin for this call must be _Signed_ and must be a "rescuer"
     * who has successfully completed the account recovery process: collected
     * `threshold` or more vouches, waited `delay_period` blocks since initiation.
     *
     * Parameters:
     * - `account`: The lost account that you want to claim has been successfully recovered by
     * you.
     */
    claim_recovery: TxDescriptor<Anonymize<Ic6cqd9g0t65v0>>;
    /**
     * As the controller of a recoverable account, close an active recovery
     * process for your account.
     *
     * Payment: By calling this function, the recoverable account will receive
     * the recovery deposit `RecoveryDeposit` placed by the rescuer.
     *
     * The dispatch origin for this call must be _Signed_ and must be a
     * recoverable account with an active recovery process for it.
     *
     * Parameters:
     * - `rescuer`: The account trying to rescue this recoverable account.
     */
    close_recovery: TxDescriptor<Anonymize<I7ka1pdlbuevh2>>;
    /**
     * Remove the recovery process for your account. Recovered accounts are still accessible.
     *
     * NOTE: The user must make sure to call `close_recovery` on all active
     * recovery attempts before calling this function else it will fail.
     *
     * Payment: By calling this function the recoverable account will unreserve
     * their recovery configuration deposit.
     * (`ConfigDepositBase` + `FriendDepositFactor` * #_of_friends)
     *
     * The dispatch origin for this call must be _Signed_ and must be a
     * recoverable account (i.e. has a recovery configuration).
     */
    remove_recovery: TxDescriptor<undefined>;
    /**
     * Cancel the ability to use `as_recovered` for `account`.
     *
     * The dispatch origin for this call must be _Signed_ and registered to
     * be able to make calls on behalf of the recovered account.
     *
     * Parameters:
     * - `account`: The recovered account you are able to call on-behalf-of.
     */
    cancel_recovered: TxDescriptor<Anonymize<Ic6cqd9g0t65v0>>;
  };
  Vesting: {
    /**
     * Unlock any vested funds of the sender account.
     *
     * The dispatch origin for this call must be _Signed_ and the sender must have funds still
     * locked under this pallet.
     *
     * Emits either `VestingCompleted` or `VestingUpdated`.
     *
     * ## Complexity
     * - `O(1)`.
     */
    vest: TxDescriptor<undefined>;
    /**
     * Unlock any vested funds of a `target` account.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `target`: The account whose vested funds should be unlocked. Must have funds still
     * locked under this pallet.
     *
     * Emits either `VestingCompleted` or `VestingUpdated`.
     *
     * ## Complexity
     * - `O(1)`.
     */
    vest_other: TxDescriptor<Anonymize<Id9uqtigc0il3v>>;
    /**
     * Create a vested transfer.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `target`: The account receiving the vested funds.
     * - `schedule`: The vesting schedule attached to the transfer.
     *
     * Emits `VestingCreated`.
     *
     * NOTE: This will unlock all schedules through the current block.
     *
     * ## Complexity
     * - `O(1)`.
     */
    vested_transfer: TxDescriptor<Anonymize<Iaa2o6cgjdpdn5>>;
    /**
     * Force a vested transfer.
     *
     * The dispatch origin for this call must be _Root_.
     *
     * - `source`: The account whose funds should be transferred.
     * - `target`: The account that should be transferred the vested funds.
     * - `schedule`: The vesting schedule attached to the transfer.
     *
     * Emits `VestingCreated`.
     *
     * NOTE: This will unlock all schedules through the current block.
     *
     * ## Complexity
     * - `O(1)`.
     */
    force_vested_transfer: TxDescriptor<Anonymize<Iam6hrl7ptd85l>>;
    /**
     * Merge two vesting schedules together, creating a new vesting schedule that unlocks over
     * the highest possible start and end blocks. If both schedules have already started the
     * current block will be used as the schedule start; with the caveat that if one schedule
     * is finished by the current block, the other will be treated as the new merged schedule,
     * unmodified.
     *
     * NOTE: If `schedule1_index == schedule2_index` this is a no-op.
     * NOTE: This will unlock all schedules through the current block prior to merging.
     * NOTE: If both schedules have ended by the current block, no new schedule will be created
     * and both will be removed.
     *
     * Merged schedule attributes:
     * - `starting_block`: `MAX(schedule1.starting_block, scheduled2.starting_block,
     * current_block)`.
     * - `ending_block`: `MAX(schedule1.ending_block, schedule2.ending_block)`.
     * - `locked`: `schedule1.locked_at(current_block) + schedule2.locked_at(current_block)`.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `schedule1_index`: index of the first schedule to merge.
     * - `schedule2_index`: index of the second schedule to merge.
     */
    merge_schedules: TxDescriptor<Anonymize<Ict9ivhr2c5hv0>>;
    /**
     * Force remove a vesting schedule
     *
     * The dispatch origin for this call must be _Root_.
     *
     * - `target`: An account that has a vesting schedule
     * - `schedule_index`: The vesting schedule index that should be removed
     */
    force_remove_vesting_schedule: TxDescriptor<Anonymize<I8t4vv03357lk9>>;
  };
  Scheduler: {
    /**
     * Anonymously schedule a task.
     */
    schedule: TxDescriptor<Anonymize<Ife5d90tgvboq0>>;
    /**
     * Cancel an anonymously scheduled task.
     */
    cancel: TxDescriptor<Anonymize<I5n4sebgkfr760>>;
    /**
     * Schedule a named task.
     */
    schedule_named: TxDescriptor<Anonymize<I6biebuseb0v39>>;
    /**
     * Cancel a named scheduled task.
     */
    cancel_named: TxDescriptor<Anonymize<Ifs1i5fk9cqvr6>>;
    /**
     * Anonymously schedule a task after a delay.
     */
    schedule_after: TxDescriptor<Anonymize<I73s5dmcaiqpls>>;
    /**
     * Schedule a named task after a delay.
     */
    schedule_named_after: TxDescriptor<Anonymize<Ic8nm7jnv6jeul>>;
    /**
     * Set a retry configuration for a task so that, in case its scheduled run fails, it will
     * be retried after `period` blocks, for a total amount of `retries` retries or until it
     * succeeds.
     *
     * Tasks which need to be scheduled for a retry are still subject to weight metering and
     * agenda space, same as a regular task. If a periodic task fails, it will be scheduled
     * normally while the task is retrying.
     *
     * Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic
     * clones of the original task. Their retry configuration will be derived from the
     * original task's configuration, but will have a lower value for `remaining` than the
     * original `total_retries`.
     */
    set_retry: TxDescriptor<Anonymize<Ieg3fd8p4pkt10>>;
    /**
     * Set a retry configuration for a named task so that, in case its scheduled run fails, it
     * will be retried after `period` blocks, for a total amount of `retries` retries or until
     * it succeeds.
     *
     * Tasks which need to be scheduled for a retry are still subject to weight metering and
     * agenda space, same as a regular task. If a periodic task fails, it will be scheduled
     * normally while the task is retrying.
     *
     * Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic
     * clones of the original task. Their retry configuration will be derived from the
     * original task's configuration, but will have a lower value for `remaining` than the
     * original `total_retries`.
     */
    set_retry_named: TxDescriptor<Anonymize<I8kg5ll427kfqq>>;
    /**
     * Removes the retry configuration of a task.
     */
    cancel_retry: TxDescriptor<Anonymize<I467333262q1l9>>;
    /**
     * Cancel the retry configuration of a named task.
     */
    cancel_retry_named: TxDescriptor<Anonymize<Ifs1i5fk9cqvr6>>;
  };
  Proxy: {
    /**
     * Dispatch the given `call` from an account that the sender is authorised for through
     * `add_proxy`.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `real`: The account that the proxy will make a call on behalf of.
     * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
     * - `call`: The call to be made by the `real` account.
     */
    proxy: TxDescriptor<Anonymize<I67o1b46l3uf5e>>;
    /**
     * Register a proxy account for the sender that is able to make calls on its behalf.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `proxy`: The account that the `caller` would like to make a proxy.
     * - `proxy_type`: The permissions allowed for this proxy account.
     * - `delay`: The announcement period required of the initial proxy. Will generally be
     * zero.
     */
    add_proxy: TxDescriptor<Anonymize<I81psug9dsrjik>>;
    /**
     * Unregister a proxy account for the sender.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `proxy`: The account that the `caller` would like to remove as a proxy.
     * - `proxy_type`: The permissions currently enabled for the removed proxy account.
     */
    remove_proxy: TxDescriptor<Anonymize<I81psug9dsrjik>>;
    /**
     * Unregister all proxy accounts for the sender.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * WARNING: This may be called on accounts created by `pure`, however if done, then
     * the unreserved fees will be inaccessible. **All access to this account will be lost.**
     */
    remove_proxies: TxDescriptor<undefined>;
    /**
     * Spawn a fresh new account that is guaranteed to be otherwise inaccessible, and
     * initialize it with a proxy of `proxy_type` for `origin` sender.
     *
     * Requires a `Signed` origin.
     *
     * - `proxy_type`: The type of the proxy that the sender will be registered as over the
     * new account. This will almost always be the most permissive `ProxyType` possible to
     * allow for maximum flexibility.
     * - `index`: A disambiguation index, in case this is called multiple times in the same
     * transaction (e.g. with `utility::batch`). Unless you're using `batch` you probably just
     * want to use `0`.
     * - `delay`: The announcement period required of the initial proxy. Will generally be
     * zero.
     *
     * Fails with `Duplicate` if this has already been called in this transaction, from the
     * same sender, with the same parameters.
     *
     * Fails if there are insufficient funds to pay for deposit.
     */
    create_pure: TxDescriptor<Anonymize<Ifd1qham1gpgjc>>;
    /**
     * Removes a previously spawned pure proxy.
     *
     * WARNING: **All access to this account will be lost.** Any funds held in it will be
     * inaccessible.
     *
     * Requires a `Signed` origin, and the sender account must have been created by a call to
     * `pure` with corresponding parameters.
     *
     * - `spawner`: The account that originally called `pure` to create this account.
     * - `index`: The disambiguation index originally passed to `pure`. Probably `0`.
     * - `proxy_type`: The proxy type originally passed to `pure`.
     * - `height`: The height of the chain when the call to `pure` was processed.
     * - `ext_index`: The extrinsic index in which the call to `pure` was processed.
     *
     * Fails with `NoPermission` in case the caller is not a previously created pure
     * account whose `pure` call has corresponding parameters.
     */
    kill_pure: TxDescriptor<Anonymize<I68ehmckmhc2ki>>;
    /**
     * Publish the hash of a proxy-call that will be made in the future.
     *
     * This must be called some number of blocks before the corresponding `proxy` is attempted
     * if the delay associated with the proxy relationship is greater than zero.
     *
     * No more than `MaxPending` announcements may be made at any one time.
     *
     * This will take a deposit of `AnnouncementDepositFactor` as well as
     * `AnnouncementDepositBase` if there are no other pending announcements.
     *
     * The dispatch origin for this call must be _Signed_ and a proxy of `real`.
     *
     * Parameters:
     * - `real`: The account that the proxy will make a call on behalf of.
     * - `call_hash`: The hash of the call to be made by the `real` account.
     */
    announce: TxDescriptor<Anonymize<I2eb501t8s6hsq>>;
    /**
     * Remove a given announcement.
     *
     * May be called by a proxy account to remove a call they previously announced and return
     * the deposit.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `real`: The account that the proxy will make a call on behalf of.
     * - `call_hash`: The hash of the call to be made by the `real` account.
     */
    remove_announcement: TxDescriptor<Anonymize<I2eb501t8s6hsq>>;
    /**
     * Remove the given announcement of a delegate.
     *
     * May be called by a target (proxied) account to remove a call that one of their delegates
     * (`delegate`) has announced they want to execute. The deposit is returned.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `delegate`: The account that previously announced the call.
     * - `call_hash`: The hash of the call to be made.
     */
    reject_announcement: TxDescriptor<Anonymize<Ianmuoljk2sk1u>>;
    /**
     * Dispatch the given `call` from an account that the sender is authorized for through
     * `add_proxy`.
     *
     * Removes any corresponding announcement(s).
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Parameters:
     * - `real`: The account that the proxy will make a call on behalf of.
     * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
     * - `call`: The call to be made by the `real` account.
     */
    proxy_announced: TxDescriptor<Anonymize<Ifhdf5gi90p0p8>>;
  };
  Multisig: {
    /**
     * Immediately dispatch a multi-signature call using a single approval from the caller.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `other_signatories`: The accounts (other than the sender) who are part of the
     * multi-signature, but do not participate in the approval process.
     * - `call`: The call to be executed.
     *
     * Result is equivalent to the dispatched result.
     *
     * ## Complexity
     * O(Z + C) where Z is the length of the call and C its execution weight.
     */
    as_multi_threshold_1: TxDescriptor<Anonymize<I766vif45kghl0>>;
    /**
     * Register approval for a dispatch to be made from a deterministic composite account if
     * approved by a total of `threshold - 1` of `other_signatories`.
     *
     * If there are enough, then dispatch the call.
     *
     * Payment: `DepositBase` will be reserved if this is the first approval, plus
     * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
     * is cancelled.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `threshold`: The total number of approvals for this dispatch before it is executed.
     * - `other_signatories`: The accounts (other than the sender) who can approve this
     * dispatch. May not be empty.
     * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
     * not the first approval, then it must be `Some`, with the timepoint (block number and
     * transaction index) of the first approval transaction.
     * - `call`: The call to be executed.
     *
     * NOTE: Unless this is the final approval, you will generally want to use
     * `approve_as_multi` instead, since it only requires a hash of the call.
     *
     * Result is equivalent to the dispatched result if `threshold` is exactly `1`. Otherwise
     * on success, result is `Ok` and the result from the interior call, if it was executed,
     * may be found in the deposited `MultisigExecuted` event.
     *
     * ## Complexity
     * - `O(S + Z + Call)`.
     * - Up to one balance-reserve or unreserve operation.
     * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
     * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
     * - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len.
     * - One encode & hash, both of complexity `O(S)`.
     * - Up to one binary search and insert (`O(logS + S)`).
     * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
     * - One event.
     * - The weight of the `call`.
     * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
     * taken for its lifetime of `DepositBase + threshold * DepositFactor`.
     */
    as_multi: TxDescriptor<Anonymize<Iipbtt8d3t5ht>>;
    /**
     * Register approval for a dispatch to be made from a deterministic composite account if
     * approved by a total of `threshold - 1` of `other_signatories`.
     *
     * Payment: `DepositBase` will be reserved if this is the first approval, plus
     * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
     * is cancelled.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `threshold`: The total number of approvals for this dispatch before it is executed.
     * - `other_signatories`: The accounts (other than the sender) who can approve this
     * dispatch. May not be empty.
     * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
     * not the first approval, then it must be `Some`, with the timepoint (block number and
     * transaction index) of the first approval transaction.
     * - `call_hash`: The hash of the call to be executed.
     *
     * NOTE: If this is the final approval, you will want to use `as_multi` instead.
     *
     * ## Complexity
     * - `O(S)`.
     * - Up to one balance-reserve or unreserve operation.
     * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
     * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
     * - One encode & hash, both of complexity `O(S)`.
     * - Up to one binary search and insert (`O(logS + S)`).
     * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
     * - One event.
     * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
     * taken for its lifetime of `DepositBase + threshold * DepositFactor`.
     */
    approve_as_multi: TxDescriptor<Anonymize<Ideaemvoneh309>>;
    /**
     * Cancel a pre-existing, on-going multisig transaction. Any deposit reserved previously
     * for this operation will be unreserved on success.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * - `threshold`: The total number of approvals for this dispatch before it is executed.
     * - `other_signatories`: The accounts (other than the sender) who can approve this
     * dispatch. May not be empty.
     * - `timepoint`: The timepoint (block number and transaction index) of the first approval
     * transaction for this dispatch.
     * - `call_hash`: The hash of the call to be executed.
     *
     * ## Complexity
     * - `O(S)`.
     * - Up to one balance-reserve or unreserve operation.
     * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
     * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
     * - One encode & hash, both of complexity `O(S)`.
     * - One event.
     * - I/O: 1 read `O(S)`, one remove.
     * - Storage: removes one item.
     */
    cancel_as_multi: TxDescriptor<Anonymize<I3d9o9d7epp66v>>;
  };
  Preimage: {
    /**
     * Register a preimage on-chain.
     *
     * If the preimage was previously requested, no fees or deposits are taken for providing
     * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
     */
    note_preimage: TxDescriptor<Anonymize<I82nfqfkd48n10>>;
    /**
     * Clear an unrequested preimage from the runtime storage.
     *
     * If `len` is provided, then it will be a much cheaper operation.
     *
     * - `hash`: The hash of the preimage to be removed from the store.
     * - `len`: The length of the preimage of `hash`.
     */
    unnote_preimage: TxDescriptor<Anonymize<I1jm8m1rh9e20v>>;
    /**
     * Request a preimage be uploaded to the chain without paying any fees or deposits.
     *
     * If the preimage requests has already been provided on-chain, we unreserve any deposit
     * a user may have paid, and take the control of the preimage out of their hands.
     */
    request_preimage: TxDescriptor<Anonymize<I1jm8m1rh9e20v>>;
    /**
     * Clear a previously made request for a preimage.
     *
     * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
     */
    unrequest_preimage: TxDescriptor<Anonymize<I1jm8m1rh9e20v>>;
    /**
     * Ensure that the a bulk of pre-images is upgraded.
     *
     * The caller pays no fee if at least 90% of pre-images were successfully updated.
     */
    ensure_updated: TxDescriptor<Anonymize<I3o5j3bli1pd8e>>;
  };
  Bounties: {
    /**
     * Propose a new bounty.
     *
     * The dispatch origin for this call must be _Signed_.
     *
     * Payment: `TipReportDepositBase` will be reserved from the origin account, as well as
     * `DataDepositPerByte` for each byte in `reason`. It will be unreserved upon approval,
     * or slashed when rejected.
     *
     * - `curator`: The curator account whom will manage this bounty.
     * - `fee`: The curator fee.
     * - `value`: The total payment amount of this bounty, curator fee included.
     * - `description`: The description of this bounty.
     */
    propose_bounty: TxDescriptor<Anonymize<I2a839vbf5817q>>;
    /**
     * Approve a bounty proposal. At a later time, the bounty will be funded and become active
     * and the original deposit will be returned.
     *
     * May only be called from `T::SpendOrigin`.
     *
     * ## Complexity
     * - O(1).
     */
    approve_bounty: TxDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
    /**
     * Propose a curator to a funded bounty.
     *
     * May only be called from `T::SpendOrigin`.
     *
     * ## Complexity
     * - O(1).
     */
    propose_curator: TxDescriptor<Anonymize<I42bqh279uf7oa>>;
    /**
     * Unassign curator from a bounty.
     *
     * This function can only be called by the `RejectOrigin` a signed origin.
     *
     * If this function is called by the `RejectOrigin`, we assume that the curator is
     * malicious or inactive. As a result, we will slash the curator when possible.
     *
     * If the origin is the curator, we take this as a sign they are unable to do their job and
     * they willingly give up. We could slash them, but for now we allow them to recover their
     * deposit and exit without issue. (We may want to change this if it is abused.)
     *
     * Finally, the origin can be anyone if and only if the curator is "inactive". This allows
     * anyone in the community to call out that a curator is not doing their due diligence, and
     * we should pick a new curator. In this case the curator should also be slashed.
     *
     * ## Complexity
     * - O(1).
     */
    unassign_curator: TxDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
    /**
     * Accept the curator role for a bounty.
     * A deposit will be reserved from curator and refund upon successful payout.
     *
     * May only be called from the curator.
     *
     * ## Complexity
     * - O(1).
     */
    accept_curator: TxDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
    /**
     * Award bounty to a beneficiary account. The beneficiary will be able to claim the funds
     * after a delay.
     *
     * The dispatch origin for this call must be the curator of this bounty.
     *
     * - `bounty_id`: Bounty ID to award.
     * - `beneficiary`: The beneficiary account whom will receive the payout.
     *
     * ## Complexity
     * - O(1).
     */
    award_bounty: TxDescriptor<Anonymize<I4p6v96cffstms>>;
    /**
     * Claim the payout from an awarded bounty after payout delay.
     *
     * The dispatch origin for this call must be the beneficiary of this bounty.
     *
     * - `bounty_id`: Bounty ID to claim.
     *
     * ## Complexity
     * - O(1).
     */
    claim_bounty: TxDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
    /**
     * Cancel a proposed or active bounty. All the funds will be sent to treasury and
     * the curator deposit will be unreserved if possible.
     *
     * Only `T::RejectOrigin` is able to cancel a bounty.
     *
     * - `bounty_id`: Bounty ID to cancel.
     *
     * ## Complexity
     * - O(1).
     */
    close_bounty: TxDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
    /**
     * Extend the expiry time of an active bounty.
     *
     * The dispatch origin for this call must be the curator of this bounty.
     *
     * - `bounty_id`: Bounty ID to extend.
     * - `remark`: additional information.
     *
     * ## Complexity
     * - O(1).
     */
    extend_bounty_expiry: TxDescriptor<Anonymize<I90n6nnkpdahrh>>;
  };
  ChildBounties: {
    /**
     * Add a new child-bounty.
     *
     * The dispatch origin for this call must be the curator of parent
     * bounty and the parent bounty must be in "active" state.
     *
     * Child-bounty gets added successfully & fund gets transferred from
     * parent bounty to child-bounty account, if parent bounty has enough
     * funds, else the call fails.
     *
     * Upper bound to maximum number of active  child bounties that can be
     * added are managed via runtime trait config
     * [`Config::MaxActiveChildBountyCount`].
     *
     * If the call is success, the status of child-bounty is updated to
     * "Added".
     *
     * - `parent_bounty_id`: Index of parent bounty for which child-bounty is being added.
     * - `value`: Value for executing the proposal.
     * - `description`: Text description for the child-bounty.
     */
    add_child_bounty: TxDescriptor<Anonymize<I8mk5kjgn02hi8>>;
    /**
     * Propose curator for funded child-bounty.
     *
     * The dispatch origin for this call must be curator of parent bounty.
     *
     * Parent bounty must be in active state, for this child-bounty call to
     * work.
     *
     * Child-bounty must be in "Added" state, for processing the call. And
     * state of child-bounty is moved to "CuratorProposed" on successful
     * call completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     * - `curator`: Address of child-bounty curator.
     * - `fee`: payment fee to child-bounty curator for execution.
     */
    propose_curator: TxDescriptor<Anonymize<Ieqvq91sbe02ko>>;
    /**
     * Accept the curator role for the child-bounty.
     *
     * The dispatch origin for this call must be the curator of this
     * child-bounty.
     *
     * A deposit will be reserved from the curator and refund upon
     * successful payout or cancellation.
     *
     * Fee for curator is deducted from curator fee of parent bounty.
     *
     * Parent bounty must be in active state, for this child-bounty call to
     * work.
     *
     * Child-bounty must be in "CuratorProposed" state, for processing the
     * call. And state of child-bounty is moved to "Active" on successful
     * call completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     */
    accept_curator: TxDescriptor<Anonymize<I2gr10p66od9ch>>;
    /**
     * Unassign curator from a child-bounty.
     *
     * The dispatch origin for this call can be either `RejectOrigin`, or
     * the curator of the parent bounty, or any signed origin.
     *
     * For the origin other than T::RejectOrigin and the child-bounty
     * curator, parent bounty must be in active state, for this call to
     * work. We allow child-bounty curator and T::RejectOrigin to execute
     * this call irrespective of the parent bounty state.
     *
     * If this function is called by the `RejectOrigin` or the
     * parent bounty curator, we assume that the child-bounty curator is
     * malicious or inactive. As a result, child-bounty curator deposit is
     * slashed.
     *
     * If the origin is the child-bounty curator, we take this as a sign
     * that they are unable to do their job, and are willingly giving up.
     * We could slash the deposit, but for now we allow them to unreserve
     * their deposit and exit without issue. (We may want to change this if
     * it is abused.)
     *
     * Finally, the origin can be anyone iff the child-bounty curator is
     * "inactive". Expiry update due of parent bounty is used to estimate
     * inactive state of child-bounty curator.
     *
     * This allows anyone in the community to call out that a child-bounty
     * curator is not doing their due diligence, and we should pick a new
     * one. In this case the child-bounty curator deposit is slashed.
     *
     * State of child-bounty is moved to Added state on successful call
     * completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     */
    unassign_curator: TxDescriptor<Anonymize<I2gr10p66od9ch>>;
    /**
     * Award child-bounty to a beneficiary.
     *
     * The beneficiary will be able to claim the funds after a delay.
     *
     * The dispatch origin for this call must be the parent curator or
     * curator of this child-bounty.
     *
     * Parent bounty must be in active state, for this child-bounty call to
     * work.
     *
     * Child-bounty must be in active state, for processing the call. And
     * state of child-bounty is moved to "PendingPayout" on successful call
     * completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     * - `beneficiary`: Beneficiary account.
     */
    award_child_bounty: TxDescriptor<Anonymize<I9mcq66cm3gibo>>;
    /**
     * Claim the payout from an awarded child-bounty after payout delay.
     *
     * The dispatch origin for this call may be any signed origin.
     *
     * Call works independent of parent bounty state, No need for parent
     * bounty to be in active state.
     *
     * The Beneficiary is paid out with agreed bounty value. Curator fee is
     * paid & curator deposit is unreserved.
     *
     * Child-bounty must be in "PendingPayout" state, for processing the
     * call. And instance of child-bounty is removed from the state on
     * successful call completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     */
    claim_child_bounty: TxDescriptor<Anonymize<I2gr10p66od9ch>>;
    /**
     * Cancel a proposed or active child-bounty. Child-bounty account funds
     * are transferred to parent bounty account. The child-bounty curator
     * deposit may be unreserved if possible.
     *
     * The dispatch origin for this call must be either parent curator or
     * `T::RejectOrigin`.
     *
     * If the state of child-bounty is `Active`, curator deposit is
     * unreserved.
     *
     * If the state of child-bounty is `PendingPayout`, call fails &
     * returns `PendingPayout` error.
     *
     * For the origin other than T::RejectOrigin, parent bounty must be in
     * active state, for this child-bounty call to work. For origin
     * T::RejectOrigin execution is forced.
     *
     * Instance of child-bounty is removed from the state on successful
     * call completion.
     *
     * - `parent_bounty_id`: Index of parent bounty.
     * - `child_bounty_id`: Index of child bounty.
     */
    close_child_bounty: TxDescriptor<Anonymize<I2gr10p66od9ch>>;
  };
  ElectionProviderMultiPhase: {
    /**
     * Submit a solution for the unsigned phase.
     *
     * The dispatch origin fo this call must be __none__.
     *
     * This submission is checked on the fly. Moreover, this unsigned solution is only
     * validated when submitted to the pool from the **local** node. Effectively, this means
     * that only active validators can submit this transaction when authoring a block (similar
     * to an inherent).
     *
     * To prevent any incorrect solution (and thus wasted time/weight), this transaction will
     * panic if the solution submitted by the validator is invalid in any way, effectively
     * putting their authoring reward at risk.
     *
     * No deposit or reward is associated with this submission.
     */
    submit_unsigned: TxDescriptor<Anonymize<Ic50i89t5eabvg>>;
    /**
     * Set a new value for `MinimumUntrustedScore`.
     *
     * Dispatch origin must be aligned with `T::ForceOrigin`.
     *
     * This check can be turned off by setting the value to `None`.
     */
    set_minimum_untrusted_score: TxDescriptor<Anonymize<I80q14um2s2ckg>>;
    /**
     * Set a solution in the queue, to be handed out to the client of this pallet in the next
     * call to `ElectionProvider::elect`.
     *
     * This can only be set by `T::ForceOrigin`, and only when the phase is `Emergency`.
     *
     * The solution is not checked for any feasibility and is assumed to be trustworthy, as any
     * feasibility check itself can in principle cause the election process to fail (due to
     * memory/weight constrains).
     */
    set_emergency_election_result: TxDescriptor<Anonymize<I5qs1t1erfi7u8>>;
    /**
     * Submit a solution for the signed phase.
     *
     * The dispatch origin fo this call must be __signed__.
     *
     * The solution is potentially queued, based on the claimed score and processed at the end
     * of the signed phase.
     *
     * A deposit is reserved and recorded for the solution. Based on the outcome, the solution
     * might be rewarded, slashed, or get all or a part of the deposit back.
     */
    submit: TxDescriptor<Anonymize<I2ou0mtsgm3l71>>;
    /**
     * Trigger the governance fallback.
     *
     * This can only be called when [`Phase::Emergency`] is enabled, as an alternative to
     * calling [`Call::set_emergency_election_result`].
     */
    governance_fallback: TxDescriptor<Anonymize<Ifsme8miqq9006>>;
  };
  Nis: {
    /**
     * Place a bid.
     *
     * Origin must be Signed, and account must have at least `amount` in free balance.
     *
     * - `amount`: The amount of the bid; these funds will be reserved, and if/when
     * consolidated, removed. Must be at least `MinBid`.
     * - `duration`: The number of periods before which the newly consolidated bid may be
     * thawed. Must be greater than 1 and no more than `QueueCount`.
     *
     * Complexities:
     * - `Queues[duration].len()` (just take max).
     */
    place_bid: TxDescriptor<Anonymize<Icckjru8f8flpj>>;
    /**
     * Retract a previously placed bid.
     *
     * Origin must be Signed, and the account should have previously issued a still-active bid
     * of `amount` for `duration`.
     *
     * - `amount`: The amount of the previous bid.
     * - `duration`: The duration of the previous bid.
     */
    retract_bid: TxDescriptor<Anonymize<Icckjru8f8flpj>>;
    /**
     * Ensure we have sufficient funding for all potential payouts.
     *
     * - `origin`: Must be accepted by `FundOrigin`.
     */
    fund_deficit: TxDescriptor<undefined>;
    /**
     * Reduce or remove an outstanding receipt, placing the according proportion of funds into
     * the account of the owner.
     *
     * - `origin`: Must be Signed and the account must be the owner of the receipt `index` as
     * well as any fungible counterpart.
     * - `index`: The index of the receipt.
     * - `portion`: If `Some`, then only the given portion of the receipt should be thawed. If
     * `None`, then all of it should be.
     */
    thaw_private: TxDescriptor<Anonymize<Iba38lgbjrs7je>>;
    /**
     * Reduce or remove an outstanding receipt, placing the according proportion of funds into
     * the account of the owner.
     *
     * - `origin`: Must be Signed and the account must be the owner of the fungible counterpart
     * for receipt `index`.
     * - `index`: The index of the receipt.
     */
    thaw_communal: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Make a private receipt communal and create fungible counterparts for its owner.
     */
    communify: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Make a communal receipt private and burn fungible counterparts from its owner.
     */
    privatize: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
  };
  NisCounterpartBalances: {
    /**
     * Transfer some liquid free balance to another account.
     *
     * `transfer_allow_death` will set the `FreeBalance` of the sender and receiver.
     * If the sender's account is below the existential deposit as a result
     * of the transfer, the account will be reaped.
     *
     * The dispatch origin for this call must be `Signed` by the transactor.
     */
    transfer_allow_death: TxDescriptor<Anonymize<I4ktuaksf5i1gk>>;
    /**
     * Exactly as `transfer_allow_death`, except the origin must be root and the source account
     * may be specified.
     */
    force_transfer: TxDescriptor<Anonymize<I9bqtpv2ii35mp>>;
    /**
     * Same as the [`transfer_allow_death`] call, but with a check that the transfer will not
     * kill the origin account.
     *
     * 99% of the time you want [`transfer_allow_death`] instead.
     *
     * [`transfer_allow_death`]: struct.Pallet.html#method.transfer
     */
    transfer_keep_alive: TxDescriptor<Anonymize<I4ktuaksf5i1gk>>;
    /**
     * Transfer the entire transferable balance from the caller account.
     *
     * NOTE: This function only attempts to transfer _transferable_ balances. This means that
     * any locked, reserved, or existential deposits (when `keep_alive` is `true`), will not be
     * transferred by this function. To ensure that this function results in a killed account,
     * you might need to prepare the account by removing any reference counters, storage
     * deposits, etc...
     *
     * The dispatch origin of this call must be Signed.
     *
     * - `dest`: The recipient of the transfer.
     * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
     * of the funds the account has, causing the sender account to be killed (false), or
     * transfer everything except at least the existential deposit, which will guarantee to
     * keep the sender account alive (true).
     */
    transfer_all: TxDescriptor<Anonymize<I9j7pagd6d4bda>>;
    /**
     * Unreserve some balance from a user by force.
     *
     * Can only be called by ROOT.
     */
    force_unreserve: TxDescriptor<Anonymize<I2h9pmio37r7fb>>;
    /**
     * Upgrade a specified account.
     *
     * - `origin`: Must be `Signed`.
     * - `who`: The account to be upgraded.
     *
     * This will waive the transaction fee if at least all but 10% of the accounts needed to
     * be upgraded. (We let some not have to be upgraded just in order to allow for the
     * possibility of churn).
     */
    upgrade_accounts: TxDescriptor<Anonymize<Ibmr18suc9ikh9>>;
    /**
     * Set the regular balance of a given account.
     *
     * The dispatch origin for this call is `root`.
     */
    force_set_balance: TxDescriptor<Anonymize<I9iq22t0burs89>>;
    /**
     * Adjust the total issuance in a saturating way.
     *
     * Can only be called by root and always needs a positive `delta`.
     *
     * # Example
     */
    force_adjust_total_issuance: TxDescriptor<Anonymize<I5u8olqbbvfnvf>>;
    /**
     * Burn the specified liquid free balance from the origin account.
     *
     * If the origin's account ends up below the existential deposit as a result
     * of the burn and `keep_alive` is false, the account will be reaped.
     *
     * Unlike sending funds to a _burn_ address, which merely makes the funds inaccessible,
     * this `burn` operation will reduce total issuance by the amount _burned_.
     */
    burn: TxDescriptor<Anonymize<I5utcetro501ir>>;
  };
  VoterList: {
    /**
     * Declare that some `dislocated` account has, through rewards or penalties, sufficiently
     * changed its score that it should properly fall into a different bag than its current
     * one.
     *
     * Anyone can call this function about any potentially dislocated account.
     *
     * Will always update the stored score of `dislocated` to the correct score, based on
     * `ScoreProvider`.
     *
     * If `dislocated` does not exists, it returns an error.
     */
    rebag: TxDescriptor<Anonymize<Id9js0aucdivjk>>;
    /**
     * Move the caller's Id directly in front of `lighter`.
     *
     * The dispatch origin for this call must be _Signed_ and can only be called by the Id of
     * the account going in front of `lighter`. Fee is payed by the origin under all
     * circumstances.
     *
     * Only works if:
     *
     * - both nodes are within the same bag,
     * - and `origin` has a greater `Score` than `lighter`.
     */
    put_in_front_of: TxDescriptor<Anonymize<I1vj3e1a62je3o>>;
    /**
     * Same as [`Pallet::put_in_front_of`], but it can be called by anyone.
     *
     * Fee is paid by the origin under all circumstances.
     */
    put_in_front_of_other: TxDescriptor<Anonymize<I6c1t14l6giceg>>;
  };
  NominationPools: {
    /**
     * Stake funds with a pool. The amount to bond is delegated (or transferred based on
     * [`adapter::StakeStrategyType`]) from the member to the pool account and immediately
     * increases the pool's bond.
     *
     * The method of transferring the amount to the pool account is determined by
     * [`adapter::StakeStrategyType`]. If the pool is configured to use
     * [`adapter::StakeStrategyType::Delegate`], the funds remain in the account of
     * the `origin`, while the pool gains the right to use these funds for staking.
     *
     * # Note
     *
     * * An account can only be a member of a single pool.
     * * An account cannot join the same pool multiple times.
     * * This call will *not* dust the member account, so the member must have at least
     * `existential deposit + amount` in their account.
     * * Only a pool with [`PoolState::Open`] can be joined
     */
    join: TxDescriptor<Anonymize<Ieg1oc56mamrl5>>;
    /**
     * Bond `extra` more funds from `origin` into the pool to which they already belong.
     *
     * Additional funds can come from either the free balance of the account, of from the
     * accumulated rewards, see [`BondExtra`].
     *
     * Bonding extra funds implies an automatic payout of all pending rewards as well.
     * See `bond_extra_other` to bond pending rewards of `other` members.
     */
    bond_extra: TxDescriptor<Anonymize<I2vu5vj7173ik9>>;
    /**
     * A bonded member can use this to claim their payout based on the rewards that the pool
     * has accumulated since their last claimed payout (OR since joining if this is their first
     * time claiming rewards). The payout will be transferred to the member's account.
     *
     * The member will earn rewards pro rata based on the members stake vs the sum of the
     * members in the pools stake. Rewards do not "expire".
     *
     * See `claim_payout_other` to claim rewards on behalf of some `other` pool member.
     */
    claim_payout: TxDescriptor<undefined>;
    /**
     * Unbond up to `unbonding_points` of the `member_account`'s funds from the pool. It
     * implicitly collects the rewards one last time, since not doing so would mean some
     * rewards would be forfeited.
     *
     * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
     * account).
     *
     * # Conditions for a permissionless dispatch.
     *
     * * The pool is blocked and the caller is either the root or bouncer. This is refereed to
     * as a kick.
     * * The pool is destroying and the member is not the depositor.
     * * The pool is destroying, the member is the depositor and no other members are in the
     * pool.
     *
     * ## Conditions for permissioned dispatch (i.e. the caller is also the
     * `member_account`):
     *
     * * The caller is not the depositor.
     * * The caller is the depositor, the pool is destroying and no other members are in the
     * pool.
     *
     * # Note
     *
     * If there are too many unlocking chunks to unbond with the pool account,
     * [`Call::pool_withdraw_unbonded`] can be called to try and minimize unlocking chunks.
     * The [`StakingInterface::unbond`] will implicitly call [`Call::pool_withdraw_unbonded`]
     * to try to free chunks if necessary (ie. if unbound was called and no unlocking chunks
     * are available). However, it may not be possible to release the current unlocking chunks,
     * in which case, the result of this call will likely be the `NoMoreChunks` error from the
     * staking system.
     */
    unbond: TxDescriptor<Anonymize<I6galqkn58q3bl>>;
    /**
     * Call `withdraw_unbonded` for the pools account. This call can be made by any account.
     *
     * This is useful if there are too many unlocking chunks to call `unbond`, and some
     * can be cleared by withdrawing. In the case there are too many unlocking chunks, the user
     * would probably see an error like `NoMoreChunks` emitted from the staking system when
     * they attempt to unbond.
     */
    pool_withdraw_unbonded: TxDescriptor<Anonymize<I36uoc8t9liv80>>;
    /**
     * Withdraw unbonded funds from `member_account`. If no bonded funds can be unbonded, an
     * error is returned.
     *
     * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
     * account).
     *
     * # Conditions for a permissionless dispatch
     *
     * * The pool is in destroy mode and the target is not the depositor.
     * * The target is the depositor and they are the only member in the sub pools.
     * * The pool is blocked and the caller is either the root or bouncer.
     *
     * # Conditions for permissioned dispatch
     *
     * * The caller is the target and they are not the depositor.
     *
     * # Note
     *
     * - If the target is the depositor, the pool will be destroyed.
     * - If the pool has any pending slash, we also try to slash the member before letting them
     * withdraw. This calculation adds some weight overhead and is only defensive. In reality,
     * pool slashes must have been already applied via permissionless [`Call::apply_slash`].
     */
    withdraw_unbonded: TxDescriptor<Anonymize<Ibunghsg9qa7f7>>;
    /**
     * Create a new delegation pool.
     *
     * # Arguments
     *
     * * `amount` - The amount of funds to delegate to the pool. This also acts of a sort of
     * deposit since the pools creator cannot fully unbond funds until the pool is being
     * destroyed.
     * * `index` - A disambiguation index for creating the account. Likely only useful when
     * creating multiple pools in the same extrinsic.
     * * `root` - The account to set as [`PoolRoles::root`].
     * * `nominator` - The account to set as the [`PoolRoles::nominator`].
     * * `bouncer` - The account to set as the [`PoolRoles::bouncer`].
     *
     * # Note
     *
     * In addition to `amount`, the caller will transfer the existential deposit; so the caller
     * needs at have at least `amount + existential_deposit` transferable.
     */
    create: TxDescriptor<Anonymize<I8qnouj2c0igph>>;
    /**
     * Create a new delegation pool with a previously used pool id
     *
     * # Arguments
     *
     * same as `create` with the inclusion of
     * * `pool_id` - `A valid PoolId.
     */
    create_with_pool_id: TxDescriptor<Anonymize<Ic30e2k517a3ns>>;
    /**
     * Nominate on behalf of the pool.
     *
     * The dispatch origin of this call must be signed by the pool nominator or the pool
     * root role.
     *
     * This directly forward the call to the staking pallet, on behalf of the pool bonded
     * account.
     *
     * # Note
     *
     * In addition to a `root` or `nominator` role of `origin`, pool's depositor needs to have
     * at least `depositor_min_bond` in the pool to start nominating.
     */
    nominate: TxDescriptor<Anonymize<I47a2tsd2o2b1c>>;
    /**
     * Set a new state for the pool.
     *
     * If a pool is already in the `Destroying` state, then under no condition can its state
     * change again.
     *
     * The dispatch origin of this call must be either:
     *
     * 1. signed by the bouncer, or the root role of the pool,
     * 2. if the pool conditions to be open are NOT met (as described by `ok_to_be_open`), and
     * then the state of the pool can be permissionlessly changed to `Destroying`.
     */
    set_state: TxDescriptor<Anonymize<Ifc9k1s0e9nv8e>>;
    /**
     * Set a new metadata for the pool.
     *
     * The dispatch origin of this call must be signed by the bouncer, or the root role of the
     * pool.
     */
    set_metadata: TxDescriptor<Anonymize<I4ihj26hl75e5p>>;
    /**
     * Update configurations for the nomination pools. The origin for this call must be
     * [`Config::AdminOrigin`].
     *
     * # Arguments
     *
     * * `min_join_bond` - Set [`MinJoinBond`].
     * * `min_create_bond` - Set [`MinCreateBond`].
     * * `max_pools` - Set [`MaxPools`].
     * * `max_members` - Set [`MaxPoolMembers`].
     * * `max_members_per_pool` - Set [`MaxPoolMembersPerPool`].
     * * `global_max_commission` - Set [`GlobalMaxCommission`].
     */
    set_configs: TxDescriptor<Anonymize<I2dl8ekhm2t22h>>;
    /**
     * Update the roles of the pool.
     *
     * The root is the only entity that can change any of the roles, including itself,
     * excluding the depositor, who can never change.
     *
     * It emits an event, notifying UIs of the role change. This event is quite relevant to
     * most pool members and they should be informed of changes to pool roles.
     */
    update_roles: TxDescriptor<Anonymize<I13us5e5h5645o>>;
    /**
     * Chill on behalf of the pool.
     *
     * The dispatch origin of this call can be signed by the pool nominator or the pool
     * root role, same as [`Pallet::nominate`].
     *
     * Under certain conditions, this call can be dispatched permissionlessly (i.e. by any
     * account).
     *
     * # Conditions for a permissionless dispatch:
     * * When pool depositor has less than `MinNominatorBond` staked, otherwise  pool members
     * are unable to unbond.
     *
     * # Conditions for permissioned dispatch:
     * * The caller has a nominator or root role of the pool.
     * This directly forward the call to the staking pallet, on behalf of the pool bonded
     * account.
     */
    chill: TxDescriptor<Anonymize<I931cottvong90>>;
    /**
     * `origin` bonds funds from `extra` for some pool member `member` into their respective
     * pools.
     *
     * `origin` can bond extra funds from free balance or pending rewards when `origin ==
     * other`.
     *
     * In the case of `origin != other`, `origin` can only bond extra pending rewards of
     * `other` members assuming set_claim_permission for the given member is
     * `PermissionlessCompound` or `PermissionlessAll`.
     */
    bond_extra_other: TxDescriptor<Anonymize<I7sujb8gfvuo7n>>;
    /**
     * Allows a pool member to set a claim permission to allow or disallow permissionless
     * bonding and withdrawing.
     *
     * # Arguments
     *
     * * `origin` - Member of a pool.
     * * `permission` - The permission to be applied.
     */
    set_claim_permission: TxDescriptor<Anonymize<I1ors0vru14it3>>;
    /**
     * `origin` can claim payouts on some pool member `other`'s behalf.
     *
     * Pool member `other` must have a `PermissionlessWithdraw` or `PermissionlessAll` claim
     * permission for this call to be successful.
     */
    claim_payout_other: TxDescriptor<Anonymize<I40s11r8nagn2g>>;
    /**
     * Set the commission of a pool.
     * Both a commission percentage and a commission payee must be provided in the `current`
     * tuple. Where a `current` of `None` is provided, any current commission will be removed.
     *
     * - If a `None` is supplied to `new_commission`, existing commission will be removed.
     */
    set_commission: TxDescriptor<Anonymize<I6bjj87fr5g9nl>>;
    /**
     * Set the maximum commission of a pool.
     *
     * - Initial max can be set to any `Perbill`, and only smaller values thereafter.
     * - Current commission will be lowered in the event it is higher than a new max
     * commission.
     */
    set_commission_max: TxDescriptor<Anonymize<I8cbluptqo8kbp>>;
    /**
     * Set the commission change rate for a pool.
     *
     * Initial change rate is not bounded, whereas subsequent updates can only be more
     * restrictive than the current.
     */
    set_commission_change_rate: TxDescriptor<Anonymize<I81cc4plffa1dm>>;
    /**
     * Claim pending commission.
     *
     * The dispatch origin of this call must be signed by the `root` role of the pool. Pending
     * commission is paid out and added to total claimed commission`. Total pending commission
     * is reset to zero. the current.
     */
    claim_commission: TxDescriptor<Anonymize<I931cottvong90>>;
    /**
     * Top up the deficit or withdraw the excess ED from the pool.
     *
     * When a pool is created, the pool depositor transfers ED to the reward account of the
     * pool. ED is subject to change and over time, the deposit in the reward account may be
     * insufficient to cover the ED deficit of the pool or vice-versa where there is excess
     * deposit to the pool. This call allows anyone to adjust the ED deposit of the
     * pool by either topping up the deficit or claiming the excess.
     */
    adjust_pool_deposit: TxDescriptor<Anonymize<I931cottvong90>>;
    /**
     * Set or remove a pool's commission claim permission.
     *
     * Determines who can claim the pool's pending commission. Only the `Root` role of the pool
     * is able to configure commission claim permissions.
     */
    set_commission_claim_permission: TxDescriptor<Anonymize<I3ihan8icf0c5k>>;
    /**
     * Apply a pending slash on a member.
     *
     * Fails unless [`crate::pallet::Config::StakeAdapter`] is of strategy type:
     * [`adapter::StakeStrategyType::Delegate`].
     *
     * The pending slash amount of the member must be equal or more than `ExistentialDeposit`.
     * This call can be dispatched permissionlessly (i.e. by any account). If the execution
     * is successful, fee is refunded and caller may be rewarded with a part of the slash
     * based on the [`crate::pallet::Config::StakeAdapter`] configuration.
     */
    apply_slash: TxDescriptor<Anonymize<I7ibh0fckqou49>>;
    /**
     * Migrates delegated funds from the pool account to the `member_account`.
     *
     * Fails unless [`crate::pallet::Config::StakeAdapter`] is of strategy type:
     * [`adapter::StakeStrategyType::Delegate`].
     *
     * This is a permission-less call and refunds any fee if claim is successful.
     *
     * If the pool has migrated to delegation based staking, the staked tokens of pool members
     * can be moved and held in their own account. See [`adapter::DelegateStake`]
     */
    migrate_delegation: TxDescriptor<Anonymize<I7ibh0fckqou49>>;
    /**
     * Migrate pool from [`adapter::StakeStrategyType::Transfer`] to
     * [`adapter::StakeStrategyType::Delegate`].
     *
     * Fails unless [`crate::pallet::Config::StakeAdapter`] is of strategy type:
     * [`adapter::StakeStrategyType::Delegate`].
     *
     * This call can be dispatched permissionlessly, and refunds any fee if successful.
     *
     * If the pool has already migrated to delegation based staking, this call will fail.
     */
    migrate_pool_to_delegate_stake: TxDescriptor<Anonymize<I931cottvong90>>;
  };
  FastUnstake: {
    /**
     * Register oneself for fast-unstake.
     *
     * ## Dispatch Origin
     *
     * The dispatch origin of this call must be *signed* by whoever is permitted to call
     * unbond funds by the staking system. See [`Config::Staking`].
     *
     * ## Details
     *
     * The stash associated with the origin must have no ongoing unlocking chunks. If
     * successful, this will fully unbond and chill the stash. Then, it will enqueue the stash
     * to be checked in further blocks.
     *
     * If by the time this is called, the stash is actually eligible for fast-unstake, then
     * they are guaranteed to remain eligible, because the call will chill them as well.
     *
     * If the check works, the entire staking data is removed, i.e. the stash is fully
     * unstaked.
     *
     * If the check fails, the stash remains chilled and waiting for being unbonded as in with
     * the normal staking system, but they lose part of their unbonding chunks due to consuming
     * the chain's resources.
     *
     * ## Events
     *
     * Some events from the staking and currency system might be emitted.
     */
    register_fast_unstake: TxDescriptor<undefined>;
    /**
     * Deregister oneself from the fast-unstake.
     *
     * ## Dispatch Origin
     *
     * The dispatch origin of this call must be *signed* by whoever is permitted to call
     * unbond funds by the staking system. See [`Config::Staking`].
     *
     * ## Details
     *
     * This is useful if one is registered, they are still waiting, and they change their mind.
     *
     * Note that the associated stash is still fully unbonded and chilled as a consequence of
     * calling [`Pallet::register_fast_unstake`]. Therefore, this should probably be followed
     * by a call to `rebond` in the staking system.
     *
     * ## Events
     *
     * Some events from the staking and currency system might be emitted.
     */
    deregister: TxDescriptor<undefined>;
    /**
     * Control the operation of this pallet.
     *
     * ## Dispatch Origin
     *
     * The dispatch origin of this call must be [`Config::ControlOrigin`].
     *
     * ## Details
     *
     * Can set the number of eras to check per block, and potentially other admin work.
     *
     * ## Events
     *
     * No events are emitted from this dispatch.
     */
    control: TxDescriptor<Anonymize<I9j0ul7nh7b8jv>>;
  };
  Configuration: {
    /**
     * Set the validation upgrade cooldown.
     */
    set_validation_upgrade_cooldown: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the validation upgrade delay.
     */
    set_validation_upgrade_delay: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the acceptance period for an included candidate.
     */
    set_code_retention_period: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the max validation code size for incoming upgrades.
     */
    set_max_code_size: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the max POV block size for incoming upgrades.
     */
    set_max_pov_size: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the max head data size for paras.
     */
    set_max_head_data_size: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the number of coretime execution cores.
     *
     * NOTE: that this configuration is managed by the coretime chain. Only manually change
     * this, if you really know what you are doing!
     */
    set_coretime_cores: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the max number of times a claim may timeout on a core before it is abandoned
     */
    set_max_availability_timeouts: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the parachain validator-group rotation frequency
     */
    set_group_rotation_frequency: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the availability period for paras.
     */
    set_paras_availability_period: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the scheduling lookahead, in expected number of blocks at peak throughput.
     */
    set_scheduling_lookahead: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the maximum number of validators to assign to any core.
     */
    set_max_validators_per_core: TxDescriptor<Anonymize<Id581arok0b1nj>>;
    /**
     * Set the maximum number of validators to use in parachain consensus.
     */
    set_max_validators: TxDescriptor<Anonymize<Id581arok0b1nj>>;
    /**
     * Set the dispute period, in number of sessions to keep for disputes.
     */
    set_dispute_period: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the dispute post conclusion acceptance period.
     */
    set_dispute_post_conclusion_acceptance_period: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the no show slots, in number of number of consensus slots.
     * Must be at least 1.
     */
    set_no_show_slots: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the total number of delay tranches.
     */
    set_n_delay_tranches: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the zeroth delay tranche width.
     */
    set_zeroth_delay_tranche_width: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the number of validators needed to approve a block.
     */
    set_needed_approvals: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the number of samples to do of the `RelayVRFModulo` approval assignment criterion.
     */
    set_relay_vrf_modulo_samples: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Sets the maximum items that can present in a upward dispatch queue at once.
     */
    set_max_upward_queue_count: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Sets the maximum total size of items that can present in a upward dispatch queue at
     * once.
     */
    set_max_upward_queue_size: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the critical downward message size.
     */
    set_max_downward_message_size: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Sets the maximum size of an upward message that can be sent by a candidate.
     */
    set_max_upward_message_size: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Sets the maximum number of messages that a candidate can contain.
     */
    set_max_upward_message_num_per_candidate: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Sets the number of sessions after which an HRMP open channel request expires.
     */
    set_hrmp_open_request_ttl: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Sets the amount of funds that the sender should provide for opening an HRMP channel.
     */
    set_hrmp_sender_deposit: TxDescriptor<Anonymize<I9jsikd1ghmc7l>>;
    /**
     * Sets the amount of funds that the recipient should provide for accepting opening an HRMP
     * channel.
     */
    set_hrmp_recipient_deposit: TxDescriptor<Anonymize<I9jsikd1ghmc7l>>;
    /**
     * Sets the maximum number of messages allowed in an HRMP channel at once.
     */
    set_hrmp_channel_max_capacity: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Sets the maximum total size of messages in bytes allowed in an HRMP channel at once.
     */
    set_hrmp_channel_max_total_size: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Sets the maximum number of inbound HRMP channels a parachain is allowed to accept.
     */
    set_hrmp_max_parachain_inbound_channels: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Sets the maximum size of a message that could ever be put into an HRMP channel.
     */
    set_hrmp_channel_max_message_size: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Sets the maximum number of outbound HRMP channels a parachain is allowed to open.
     */
    set_hrmp_max_parachain_outbound_channels: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Sets the maximum number of outbound HRMP messages can be sent by a candidate.
     */
    set_hrmp_max_message_num_per_candidate: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the number of session changes after which a PVF pre-checking voting is rejected.
     */
    set_pvf_voting_ttl: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Sets the minimum delay between announcing the upgrade block for a parachain until the
     * upgrade taking place.
     *
     * See the field documentation for information and constraints for the new value.
     */
    set_minimum_validation_upgrade_delay: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Setting this to true will disable consistency checks for the configuration setters.
     * Use with caution.
     */
    set_bypass_consistency_check: TxDescriptor<Anonymize<I2f6mha3v4ooda>>;
    /**
     * Set the asynchronous backing parameters.
     */
    set_async_backing_params: TxDescriptor<Anonymize<Iasqjdhasi408s>>;
    /**
     * Set PVF executor parameters.
     */
    set_executor_params: TxDescriptor<Anonymize<I6krn2lsleo87n>>;
    /**
     * Set the on demand (parathreads) base fee.
     */
    set_on_demand_base_fee: TxDescriptor<Anonymize<I9jsikd1ghmc7l>>;
    /**
     * Set the on demand (parathreads) fee variability.
     */
    set_on_demand_fee_variability: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the on demand (parathreads) queue max size.
     */
    set_on_demand_queue_max_size: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the on demand (parathreads) fee variability.
     */
    set_on_demand_target_queue_utilization: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the on demand (parathreads) ttl in the claimqueue.
     */
    set_on_demand_ttl: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set the minimum backing votes threshold.
     */
    set_minimum_backing_votes: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set/Unset a node feature.
     */
    set_node_feature: TxDescriptor<Anonymize<Iaid4btmkr5thp>>;
    /**
     * Set approval-voting-params.
     */
    set_approval_voting_params: TxDescriptor<Anonymize<I3vh014cqgmrfd>>;
    /**
     * Set scheduler-params.
     */
    set_scheduler_params: TxDescriptor<Anonymize<I559fv6um7nmhd>>;
  };
  ParaInherent: {
    /**
     * Enter the paras inherent. This will process bitfields and backed candidates.
     */
    enter: TxDescriptor<Anonymize<Ibbf0j7ol2abrv>>;
  };
  Paras: {
    /**
     * Set the storage for the parachain validation code immediately.
     */
    force_set_current_code: TxDescriptor<Anonymize<I1k3urvkqqshbc>>;
    /**
     * Set the storage for the current parachain head data immediately.
     */
    force_set_current_head: TxDescriptor<Anonymize<I2ff0ffsh15vej>>;
    /**
     * Schedule an upgrade as if it was scheduled in the given relay parent block.
     */
    force_schedule_code_upgrade: TxDescriptor<Anonymize<I1orfg86bkg123>>;
    /**
     * Note a new block head for para within the context of the current block.
     */
    force_note_new_head: TxDescriptor<Anonymize<I2ff0ffsh15vej>>;
    /**
     * Put a parachain directly into the next session's action queue.
     * We can't queue it any sooner than this without going into the
     * initializer...
     */
    force_queue_action: TxDescriptor<Anonymize<Iaus4cb3drhu9q>>;
    /**
     * Adds the validation code to the storage.
     *
     * The code will not be added if it is already present. Additionally, if PVF pre-checking
     * is running for that code, it will be instantly accepted.
     *
     * Otherwise, the code will be added into the storage. Note that the code will be added
     * into storage with reference count 0. This is to account the fact that there are no users
     * for this code yet. The caller will have to make sure that this code eventually gets
     * used by some parachain or removed from the storage to avoid storage leaks. For the
     * latter prefer to use the `poke_unused_validation_code` dispatchable to raw storage
     * manipulation.
     *
     * This function is mainly meant to be used for upgrading parachains that do not follow
     * the go-ahead signal while the PVF pre-checking feature is enabled.
     */
    add_trusted_validation_code: TxDescriptor<Anonymize<Ivnsat10lv9d6>>;
    /**
     * Remove the validation code from the storage iff the reference count is 0.
     *
     * This is better than removing the storage directly, because it will not remove the code
     * that was suddenly got used by some parachain while this dispatchable was pending
     * dispatching.
     */
    poke_unused_validation_code: TxDescriptor<Anonymize<Ibncli8qttt2c2>>;
    /**
     * Includes a statement for a PVF pre-checking vote. Potentially, finalizes the vote and
     * enacts the results if that was the last vote before achieving the supermajority.
     */
    include_pvf_check_statement: TxDescriptor<Anonymize<I33rft6ag34efs>>;
    /**
     * Set the storage for the current parachain head data immediately.
     */
    force_set_most_recent_context: TxDescriptor<Anonymize<I9tmok5kceg2bg>>;
  };
  Initializer: {
    /**
     * Issue a signal to the consensus engine to forcibly act as though all parachain
     * blocks in all relay chain blocks up to and including the given number in the current
     * chain are valid and should be finalized.
     */
    force_approve: TxDescriptor<Anonymize<I85icj2qbjeqbe>>;
  };
  Hrmp: {
    /**
     * Initiate opening a channel from a parachain to a given recipient with given channel
     * parameters.
     *
     * - `proposed_max_capacity` - specifies how many messages can be in the channel at once.
     * - `proposed_max_message_size` - specifies the maximum size of the messages.
     *
     * These numbers are a subject to the relay-chain configuration limits.
     *
     * The channel can be opened only after the recipient confirms it and only on a session
     * change.
     */
    hrmp_init_open_channel: TxDescriptor<Anonymize<Ibuhbp68e6tkct>>;
    /**
     * Accept a pending open channel request from the given sender.
     *
     * The channel will be opened only on the next session boundary.
     */
    hrmp_accept_open_channel: TxDescriptor<Anonymize<Idrevppfiubhve>>;
    /**
     * Initiate unilateral closing of a channel. The origin must be either the sender or the
     * recipient in the channel being closed.
     *
     * The closure can only happen on a session change.
     */
    hrmp_close_channel: TxDescriptor<Anonymize<I9s2h36kr71vk9>>;
    /**
     * This extrinsic triggers the cleanup of all the HRMP storage items that a para may have.
     * Normally this happens once per session, but this allows you to trigger the cleanup
     * immediately for a specific parachain.
     *
     * Number of inbound and outbound channels for `para` must be provided as witness data.
     *
     * Origin must be the `ChannelManager`.
     */
    force_clean_hrmp: TxDescriptor<Anonymize<I4lkbiubo9ogq9>>;
    /**
     * Force process HRMP open channel requests.
     *
     * If there are pending HRMP open channel requests, you can use this function to process
     * all of those requests immediately.
     *
     * Total number of opening channels must be provided as witness data.
     *
     * Origin must be the `ChannelManager`.
     */
    force_process_hrmp_open: TxDescriptor<Anonymize<Id1baei7m8gkhk>>;
    /**
     * Force process HRMP close channel requests.
     *
     * If there are pending HRMP close channel requests, you can use this function to process
     * all of those requests immediately.
     *
     * Total number of closing channels must be provided as witness data.
     *
     * Origin must be the `ChannelManager`.
     */
    force_process_hrmp_close: TxDescriptor<Anonymize<Id1baei7m8gkhk>>;
    /**
     * This cancels a pending open channel request. It can be canceled by either of the sender
     * or the recipient for that request. The origin must be either of those.
     *
     * The cancellation happens immediately. It is not possible to cancel the request if it is
     * already accepted.
     *
     * Total number of open requests (i.e. `HrmpOpenChannelRequestsList`) must be provided as
     * witness data.
     */
    hrmp_cancel_open_request: TxDescriptor<Anonymize<I96ftepqm4vs7m>>;
    /**
     * Open a channel from a `sender` to a `recipient` `ParaId`. Although opened by governance,
     * the `max_capacity` and `max_message_size` are still subject to the Relay Chain's
     * configured limits.
     *
     * Expected use is when one (and only one) of the `ParaId`s involved in the channel is
     * governed by the system, e.g. a system parachain.
     *
     * Origin must be the `ChannelManager`.
     */
    force_open_hrmp_channel: TxDescriptor<Anonymize<Ic3430470j4mbv>>;
    /**
     * Establish an HRMP channel between two system chains. If the channel does not already
     * exist, the transaction fees will be refunded to the caller. The system does not take
     * deposits for channels between system chains, and automatically sets the message number
     * and size limits to the maximum allowed by the network's configuration.
     *
     * Arguments:
     *
     * - `sender`: A system chain, `ParaId`.
     * - `recipient`: A system chain, `ParaId`.
     *
     * Any signed origin can call this function, but _both_ inputs MUST be system chains. If
     * the channel does not exist yet, there is no fee.
     */
    establish_system_channel: TxDescriptor<Anonymize<I50mrcbubp554e>>;
    /**
     * Update the deposits held for an HRMP channel to the latest `Configuration`. Channels
     * with system chains do not require a deposit.
     *
     * Arguments:
     *
     * - `sender`: A chain, `ParaId`.
     * - `recipient`: A chain, `ParaId`.
     *
     * Any signed origin can call this function.
     */
    poke_channel_deposits: TxDescriptor<Anonymize<I50mrcbubp554e>>;
    /**
     * Establish a bidirectional HRMP channel between a parachain and a system chain.
     *
     * Arguments:
     *
     * - `target_system_chain`: A system chain, `ParaId`.
     *
     * The origin needs to be the parachain origin.
     */
    establish_channel_with_system: TxDescriptor<Anonymize<Ic3n7nqb6fffo0>>;
  };
  ParasDisputes: {
    /**
        
         */
    force_unfreeze: TxDescriptor<undefined>;
  };
  ParasSlashing: {
    /**
        
         */
    report_dispute_lost_unsigned: TxDescriptor<Anonymize<I437u7rqtshfms>>;
  };
  OnDemandAssignmentProvider: {
    /**
     * Create a single on demand core order.
     * Will use the spot price for the current block and will reap the account if needed.
     *
     * Parameters:
     * - `origin`: The sender of the call, funds will be withdrawn from this account.
     * - `max_amount`: The maximum balance to withdraw from the origin to place an order.
     * - `para_id`: A `ParaId` the origin wants to provide blockspace for.
     *
     * Errors:
     * - `InsufficientBalance`: from the Currency implementation
     * - `QueueFull`
     * - `SpotPriceHigherThanMaxAmount`
     *
     * Events:
     * - `OnDemandOrderPlaced`
     */
    place_order_allow_death: TxDescriptor<Anonymize<Iaa7g3f5tlv3gf>>;
    /**
     * Same as the [`place_order_allow_death`](Self::place_order_allow_death) call , but with a
     * check that placing the order will not reap the account.
     *
     * Parameters:
     * - `origin`: The sender of the call, funds will be withdrawn from this account.
     * - `max_amount`: The maximum balance to withdraw from the origin to place an order.
     * - `para_id`: A `ParaId` the origin wants to provide blockspace for.
     *
     * Errors:
     * - `InsufficientBalance`: from the Currency implementation
     * - `QueueFull`
     * - `SpotPriceHigherThanMaxAmount`
     *
     * Events:
     * - `OnDemandOrderPlaced`
     */
    place_order_keep_alive: TxDescriptor<Anonymize<Iaa7g3f5tlv3gf>>;
  };
  Registrar: {
    /**
     * Register head data and validation code for a reserved Para Id.
     *
     * ## Arguments
     * - `origin`: Must be called by a `Signed` origin.
     * - `id`: The para ID. Must be owned/managed by the `origin` signing account.
     * - `genesis_head`: The genesis head data of the parachain/thread.
     * - `validation_code`: The initial validation code of the parachain/thread.
     *
     * ## Deposits/Fees
     * The account with the originating signature must reserve a deposit.
     *
     * The deposit is required to cover the costs associated with storing the genesis head
     * data and the validation code.
     * This accounts for the potential to store validation code of a size up to the
     * `max_code_size`, as defined in the configuration pallet
     *
     * Anything already reserved previously for this para ID is accounted for.
     *
     * ## Events
     * The `Registered` event is emitted in case of success.
     */
    register: TxDescriptor<Anonymize<I7mf0sij342109>>;
    /**
     * Force the registration of a Para Id on the relay chain.
     *
     * This function must be called by a Root origin.
     *
     * The deposit taken can be specified for this registration. Any `ParaId`
     * can be registered, including sub-1000 IDs which are System Parachains.
     */
    force_register: TxDescriptor<Anonymize<Ibvirp862qkkup>>;
    /**
     * Deregister a Para Id, freeing all data and returning any deposit.
     *
     * The caller must be Root, the `para` owner, or the `para` itself. The para must be an
     * on-demand parachain.
     */
    deregister: TxDescriptor<Anonymize<Ic5b47dj4coa3r>>;
    /**
     * Swap a lease holding parachain with another parachain, either on-demand or lease
     * holding.
     *
     * The origin must be Root, the `para` owner, or the `para` itself.
     *
     * The swap will happen only if there is already an opposite swap pending. If there is not,
     * the swap will be stored in the pending swaps map, ready for a later confirmatory swap.
     *
     * The `ParaId`s remain mapped to the same head data and code so external code can rely on
     * `ParaId` to be a long-term identifier of a notional "parachain". However, their
     * scheduling info (i.e. whether they're an on-demand parachain or lease holding
     * parachain), auction information and the auction deposit are switched.
     */
    swap: TxDescriptor<Anonymize<Idehabrqi23sc0>>;
    /**
     * Remove a manager lock from a para. This will allow the manager of a
     * previously locked para to deregister or swap a para without using governance.
     *
     * Can only be called by the Root origin or the parachain.
     */
    remove_lock: TxDescriptor<Anonymize<Iaus4cb3drhu9q>>;
    /**
     * Reserve a Para Id on the relay chain.
     *
     * This function will reserve a new Para Id to be owned/managed by the origin account.
     * The origin account is able to register head data and validation code using `register` to
     * create an on-demand parachain. Using the Slots pallet, an on-demand parachain can then
     * be upgraded to a lease holding parachain.
     *
     * ## Arguments
     * - `origin`: Must be called by a `Signed` origin. Becomes the manager/owner of the new
     * para ID.
     *
     * ## Deposits/Fees
     * The origin must reserve a deposit of `ParaDeposit` for the registration.
     *
     * ## Events
     * The `Reserved` event is emitted in case of success, which provides the ID reserved for
     * use.
     */
    reserve: TxDescriptor<undefined>;
    /**
     * Add a manager lock from a para. This will prevent the manager of a
     * para to deregister or swap a para.
     *
     * Can be called by Root, the parachain, or the parachain manager if the parachain is
     * unlocked.
     */
    add_lock: TxDescriptor<Anonymize<Iaus4cb3drhu9q>>;
    /**
     * Schedule a parachain upgrade.
     *
     * This will kick off a check of `new_code` by all validators. After the majority of the
     * validators have reported on the validity of the code, the code will either be enacted
     * or the upgrade will be rejected. If the code will be enacted, the current code of the
     * parachain will be overwritten directly. This means that any PoV will be checked by this
     * new code. The parachain itself will not be informed explicitly that the validation code
     * has changed.
     *
     * Can be called by Root, the parachain, or the parachain manager if the parachain is
     * unlocked.
     */
    schedule_code_upgrade: TxDescriptor<Anonymize<I1k3urvkqqshbc>>;
    /**
     * Set the parachain's current head.
     *
     * Can be called by Root, the parachain, or the parachain manager if the parachain is
     * unlocked.
     */
    set_current_head: TxDescriptor<Anonymize<I2ff0ffsh15vej>>;
  };
  Slots: {
    /**
     * Just a connect into the `lease_out` call, in case Root wants to force some lease to
     * happen independently of any other on-chain mechanism to use it.
     *
     * The dispatch origin for this call must match `T::ForceOrigin`.
     */
    force_lease: TxDescriptor<Anonymize<Idfpo6162k0hq>>;
    /**
     * Clear all leases for a Para Id, refunding any deposits back to the original owners.
     *
     * The dispatch origin for this call must match `T::ForceOrigin`.
     */
    clear_all_leases: TxDescriptor<Anonymize<Iaus4cb3drhu9q>>;
    /**
     * Try to onboard a parachain that has a lease for the current lease period.
     *
     * This function can be useful if there was some state issue with a para that should
     * have onboarded, but was unable to. As long as they have a lease period, we can
     * let them onboard from here.
     *
     * Origin must be signed, but can be called by anyone.
     */
    trigger_onboard: TxDescriptor<Anonymize<Iaus4cb3drhu9q>>;
  };
  Auctions: {
    /**
     * Create a new auction.
     *
     * This can only happen when there isn't already an auction in progress and may only be
     * called by the root origin. Accepts the `duration` of this auction and the
     * `lease_period_index` of the initial lease period of the four that are to be auctioned.
     */
    new_auction: TxDescriptor<Anonymize<I19hvnphoaj44l>>;
    /**
     * Make a new bid from an account (including a parachain account) for deploying a new
     * parachain.
     *
     * Multiple simultaneous bids from the same bidder are allowed only as long as all active
     * bids overlap each other (i.e. are mutually exclusive). Bids cannot be redacted.
     *
     * - `sub` is the sub-bidder ID, allowing for multiple competing bids to be made by (and
     * funded by) the same account.
     * - `auction_index` is the index of the auction to bid on. Should just be the present
     * value of `AuctionCounter`.
     * - `first_slot` is the first lease period index of the range to bid on. This is the
     * absolute lease period index value, not an auction-specific offset.
     * - `last_slot` is the last lease period index of the range to bid on. This is the
     * absolute lease period index value, not an auction-specific offset.
     * - `amount` is the amount to bid to be held as deposit for the parachain should the
     * bid win. This amount is held throughout the range.
     */
    bid: TxDescriptor<Anonymize<I1ng31ej27mh4k>>;
    /**
     * Cancel an in-progress auction.
     *
     * Can only be called by Root origin.
     */
    cancel_auction: TxDescriptor<undefined>;
  };
  Crowdloan: {
    /**
     * Create a new crowdloaning campaign for a parachain slot with the given lease period
     * range.
     *
     * This applies a lock to your parachain configuration, ensuring that it cannot be changed
     * by the parachain manager.
     */
    create: TxDescriptor<Anonymize<I85qkvekflgteq>>;
    /**
     * Contribute to a crowd sale. This will transfer some balance over to fund a parachain
     * slot. It will be withdrawable when the crowdloan has ended and the funds are unused.
     */
    contribute: TxDescriptor<Anonymize<I1qt5nua7ua655>>;
    /**
     * Withdraw full balance of a specific contributor.
     *
     * Origin must be signed, but can come from anyone.
     *
     * The fund must be either in, or ready for, retirement. For a fund to be *in* retirement,
     * then the retirement flag must be set. For a fund to be ready for retirement, then:
     * - it must not already be in retirement;
     * - the amount of raised funds must be bigger than the _free_ balance of the account;
     * - and either:
     * - the block number must be at least `end`; or
     * - the current lease period must be greater than the fund's `last_period`.
     *
     * In this case, the fund's retirement flag is set and its `end` is reset to the current
     * block number.
     *
     * - `who`: The account whose contribution should be withdrawn.
     * - `index`: The parachain to whose crowdloan the contribution was made.
     */
    withdraw: TxDescriptor<Anonymize<Ia1u3jll6a06ae>>;
    /**
     * Automatically refund contributors of an ended crowdloan.
     * Due to weight restrictions, this function may need to be called multiple
     * times to fully refund all users. We will refund `RemoveKeysLimit` users at a time.
     *
     * Origin must be signed, but can come from anyone.
     */
    refund: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Remove a fund after the retirement period has ended and all funds have been returned.
     */
    dissolve: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Edit the configuration for an in-progress crowdloan.
     *
     * Can only be called by Root origin.
     */
    edit: TxDescriptor<Anonymize<I85qkvekflgteq>>;
    /**
     * Add an optional memo to an existing crowdloan contribution.
     *
     * Origin must be Signed, and the user must have contributed to the crowdloan.
     */
    add_memo: TxDescriptor<Anonymize<I7cl9esn1l72m7>>;
    /**
     * Poke the fund into `NewRaise`
     *
     * Origin must be Signed, and the fund has non-zero raise.
     */
    poke: TxDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * Contribute your entire balance to a crowd sale. This will transfer the entire balance of
     * a user over to fund a parachain slot. It will be withdrawable when the crowdloan has
     * ended and the funds are unused.
     */
    contribute_all: TxDescriptor<Anonymize<Id68sq6o2gm8qi>>;
  };
  Coretime: {
    /**
     * Request the configuration to be updated with the specified number of cores. Warning:
     * Since this only schedules a configuration update, it takes two sessions to come into
     * effect.
     *
     * - `origin`: Root or the Coretime Chain
     * - `count`: total number of cores
     */
    request_core_count: TxDescriptor<Anonymize<Iafscmv8tjf0ou>>;
    /**
     * Request to claim the instantaneous coretime sales revenue starting from the block it was
     * last claimed until and up to the block specified. The claimed amount value is sent back
     * to the Coretime chain in a `notify_revenue` message. At the same time, the amount is
     * teleported to the Coretime chain.
     */
    request_revenue_at: TxDescriptor<Anonymize<Ibtsa3docbr9el>>;
    /**
     * Receive instructions from the `ExternalBrokerOrigin`, detailing how a specific core is
     * to be used.
     *
     * Parameters:
     * -`origin`: The `ExternalBrokerOrigin`, assumed to be the coretime chain.
     * -`core`: The core that should be scheduled.
     * -`begin`: The starting blockheight of the instruction.
     * -`assignment`: How the blockspace should be utilised.
     * -`end_hint`: An optional hint as to when this particular set of instructions will end.
     */
    assign_core: TxDescriptor<Anonymize<I2gpmmfdqv3cdc>>;
  };
  XcmPallet: {
    /**
        
         */
    send: TxDescriptor<Anonymize<I9paqujeb1fpv6>>;
    /**
     * Teleport some assets from the local chain to some destination chain.
     *
     * **This function is deprecated: Use `limited_teleport_assets` instead.**
     *
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
     * with all fees taken as needed from the asset.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     * relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     * generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     * fee on the `dest` chain.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     * fees.
     */
    teleport_assets: TxDescriptor<Anonymize<Iakevv83i18n4r>>;
    /**
     * Transfer some assets from the local chain to the destination chain through their local,
     * destination or remote reserve.
     *
     * `assets` must have same reserve location and may not be teleportable to `dest`.
     * - `assets` have local reserve: transfer assets to sovereign account of destination
     * chain and forward a notification XCM to `dest` to mint and deposit reserve-based
     * assets to `beneficiary`.
     * - `assets` have destination reserve: burn local assets and forward a notification to
     * `dest` chain to withdraw the reserve assets from this chain's sovereign account and
     * deposit them to `beneficiary`.
     * - `assets` have remote reserve: burn local assets, forward XCM to reserve chain to move
     * reserves from this chain's SA to `dest` chain's SA, and forward another XCM to `dest`
     * to mint and deposit reserve-based assets to `beneficiary`.
     *
     * **This function is deprecated: Use `limited_reserve_transfer_assets` instead.**
     *
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
     * with all fees taken as needed from the asset.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     * relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     * generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     * fee on the `dest` (and possibly reserve) chains.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     * fees.
     */
    reserve_transfer_assets: TxDescriptor<Anonymize<Iakevv83i18n4r>>;
    /**
     * Execute an XCM message from a local, signed, origin.
     *
     * An event is deposited indicating whether `msg` could be executed completely or only
     * partially.
     *
     * No more than `max_weight` will be used in its attempted execution. If this is less than
     * the maximum amount of weight that the message could take to be executed, then no
     * execution attempt will be made.
     */
    execute: TxDescriptor<Anonymize<If2ssl12kcglhg>>;
    /**
     * Extoll that a particular destination can be communicated with through a particular
     * version of XCM.
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `location`: The destination that is being described.
     * - `xcm_version`: The latest version of XCM that `location` supports.
     */
    force_xcm_version: TxDescriptor<Anonymize<Iabk8ljl5g8c86>>;
    /**
     * Set a safe XCM version (the version that XCM should be encoded with if the most recent
     * version a destination can accept is unknown).
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `maybe_xcm_version`: The default XCM encoding version, or `None` to disable.
     */
    force_default_xcm_version: TxDescriptor<Anonymize<Ic76kfh5ebqkpl>>;
    /**
     * Ask a location to notify us regarding their XCM version and any changes to it.
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `location`: The location to which we should subscribe for XCM version notifications.
     */
    force_subscribe_version_notify: TxDescriptor<Anonymize<Icrujen33bbibf>>;
    /**
     * Require that a particular destination should no longer notify us regarding any XCM
     * version changes.
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `location`: The location to which we are currently subscribed for XCM version
     * notifications which we no longer desire.
     */
    force_unsubscribe_version_notify: TxDescriptor<Anonymize<Icrujen33bbibf>>;
    /**
     * Transfer some assets from the local chain to the destination chain through their local,
     * destination or remote reserve.
     *
     * `assets` must have same reserve location and may not be teleportable to `dest`.
     * - `assets` have local reserve: transfer assets to sovereign account of destination
     * chain and forward a notification XCM to `dest` to mint and deposit reserve-based
     * assets to `beneficiary`.
     * - `assets` have destination reserve: burn local assets and forward a notification to
     * `dest` chain to withdraw the reserve assets from this chain's sovereign account and
     * deposit them to `beneficiary`.
     * - `assets` have remote reserve: burn local assets, forward XCM to reserve chain to move
     * reserves from this chain's SA to `dest` chain's SA, and forward another XCM to `dest`
     * to mint and deposit reserve-based assets to `beneficiary`.
     *
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
     * is needed than `weight_limit`, then the operation will fail and the sent assets may be
     * at risk.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     * relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     * generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     * fee on the `dest` (and possibly reserve) chains.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     * fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    limited_reserve_transfer_assets: TxDescriptor<Anonymize<I5gi8h3e5lkbeq>>;
    /**
     * Teleport some assets from the local chain to some destination chain.
     *
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
     * is needed than `weight_limit`, then the operation will fail and the sent assets may be
     * at risk.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     * relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     * generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     * fee on the `dest` chain.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     * fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    limited_teleport_assets: TxDescriptor<Anonymize<I5gi8h3e5lkbeq>>;
    /**
     * Set or unset the global suspension state of the XCM executor.
     *
     * - `origin`: Must be an origin specified by AdminOrigin.
     * - `suspended`: `true` to suspend, `false` to resume.
     */
    force_suspension: TxDescriptor<Anonymize<Ibgm4rnf22lal1>>;
    /**
     * Transfer some assets from the local chain to the destination chain through their local,
     * destination or remote reserve, or through teleports.
     *
     * Fee payment on the destination side is made from the asset in the `assets` vector of
     * index `fee_asset_item` (hence referred to as `fees`), up to enough to pay for
     * `weight_limit` of weight. If more weight is needed than `weight_limit`, then the
     * operation will fail and the sent assets may be at risk.
     *
     * `assets` (excluding `fees`) must have same reserve location or otherwise be teleportable
     * to `dest`, no limitations imposed on `fees`.
     * - for local reserve: transfer assets to sovereign account of destination chain and
     * forward a notification XCM to `dest` to mint and deposit reserve-based assets to
     * `beneficiary`.
     * - for destination reserve: burn local assets and forward a notification to `dest` chain
     * to withdraw the reserve assets from this chain's sovereign account and deposit them
     * to `beneficiary`.
     * - for remote reserve: burn local assets, forward XCM to reserve chain to move reserves
     * from this chain's SA to `dest` chain's SA, and forward another XCM to `dest` to mint
     * and deposit reserve-based assets to `beneficiary`.
     * - for teleports: burn local assets and forward XCM to `dest` chain to mint/teleport
     * assets and deposit them to `beneficiary`.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `X2(Parent,
     * Parachain(..))` to send from parachain to parachain, or `X1(Parachain(..))` to send
     * from relay to parachain.
     * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
     * generally be an `AccountId32` value.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     * fee on the `dest` (and possibly reserve) chains.
     * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
     * fees.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    transfer_assets: TxDescriptor<Anonymize<I5gi8h3e5lkbeq>>;
    /**
     * Claims assets trapped on this pallet because of leftover assets during XCM execution.
     *
     * - `origin`: Anyone can call this extrinsic.
     * - `assets`: The exact assets that were trapped. Use the version to specify what version
     * was the latest when they were trapped.
     * - `beneficiary`: The location/account where the claimed assets will be deposited.
     */
    claim_assets: TxDescriptor<Anonymize<I8mmaab8je28oo>>;
    /**
     * Transfer assets from the local chain to the destination chain using explicit transfer
     * types for assets and fees.
     *
     * `assets` must have same reserve location or may be teleportable to `dest`. Caller must
     * provide the `assets_transfer_type` to be used for `assets`:
     * - `TransferType::LocalReserve`: transfer assets to sovereign account of destination
     * chain and forward a notification XCM to `dest` to mint and deposit reserve-based
     * assets to `beneficiary`.
     * - `TransferType::DestinationReserve`: burn local assets and forward a notification to
     * `dest` chain to withdraw the reserve assets from this chain's sovereign account and
     * deposit them to `beneficiary`.
     * - `TransferType::RemoteReserve(reserve)`: burn local assets, forward XCM to `reserve`
     * chain to move reserves from this chain's SA to `dest` chain's SA, and forward another
     * XCM to `dest` to mint and deposit reserve-based assets to `beneficiary`. Typically
     * the remote `reserve` is Asset Hub.
     * - `TransferType::Teleport`: burn local assets and forward XCM to `dest` chain to
     * mint/teleport assets and deposit them to `beneficiary`.
     *
     * On the destination chain, as well as any intermediary hops, `BuyExecution` is used to
     * buy execution using transferred `assets` identified by `remote_fees_id`.
     * Make sure enough of the specified `remote_fees_id` asset is included in the given list
     * of `assets`. `remote_fees_id` should be enough to pay for `weight_limit`. If more weight
     * is needed than `weight_limit`, then the operation will fail and the sent assets may be
     * at risk.
     *
     * `remote_fees_id` may use different transfer type than rest of `assets` and can be
     * specified through `fees_transfer_type`.
     *
     * The caller needs to specify what should happen to the transferred assets once they reach
     * the `dest` chain. This is done through the `custom_xcm_on_dest` parameter, which
     * contains the instructions to execute on `dest` as a final step.
     * This is usually as simple as:
     * `Xcm(vec![DepositAsset { assets: Wild(AllCounted(assets.len())), beneficiary }])`,
     * but could be something more exotic like sending the `assets` even further.
     *
     * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
     * - `dest`: Destination context for the assets. Will typically be `[Parent,
     * Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
     * relay to parachain, or `(parents: 2, (GlobalConsensus(..), ..))` to send from
     * parachain across a bridge to another ecosystem destination.
     * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
     * fee on the `dest` (and possibly reserve) chains.
     * - `assets_transfer_type`: The XCM `TransferType` used to transfer the `assets`.
     * - `remote_fees_id`: One of the included `assets` to be used to pay fees.
     * - `fees_transfer_type`: The XCM `TransferType` used to transfer the `fees` assets.
     * - `custom_xcm_on_dest`: The XCM to be executed on `dest` chain as the last step of the
     * transfer, which also determines what happens to the assets on the destination chain.
     * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
     */
    transfer_assets_using_type_and_then: TxDescriptor<Anonymize<I6r0pr82pbiftt>>;
  };
  MessageQueue: {
    /**
     * Remove a page which has no more messages remaining to be processed or is stale.
     */
    reap_page: TxDescriptor<Anonymize<Ibv4ep0hngvn9e>>;
    /**
     * Execute an overweight message.
     *
     * Temporary processing errors will be propagated whereas permanent errors are treated
     * as success condition.
     *
     * - `origin`: Must be `Signed`.
     * - `message_origin`: The origin from which the message to be executed arrived.
     * - `page`: The page in the queue in which the message to be executed is sitting.
     * - `index`: The index into the queue of the message to be executed.
     * - `weight_limit`: The maximum amount of weight allowed to be consumed in the execution
     * of the message.
     *
     * Benchmark complexity considerations: O(index + weight_limit).
     */
    execute_overweight: TxDescriptor<Anonymize<Ieoqregtp7b00>>;
  };
  AssetRate: {
    /**
     * Initialize a conversion rate to native balance for the given asset.
     *
     * ## Complexity
     * - O(1)
     */
    create: TxDescriptor<Anonymize<I6nmp4rhqla35>>;
    /**
     * Update the conversion rate to native balance for the given asset.
     *
     * ## Complexity
     * - O(1)
     */
    update: TxDescriptor<Anonymize<I6nmp4rhqla35>>;
    /**
     * Remove an existing conversion rate to native balance for the given asset.
     *
     * ## Complexity
     * - O(1)
     */
    remove: TxDescriptor<Anonymize<I8ndstn7sf4kek>>;
  };
  Beefy: {
    /**
     * Report voter equivocation/misbehavior. This method will verify the
     * equivocation proof and validate the given key ownership proof
     * against the extracted offender. If both are valid, the offence
     * will be reported.
     */
    report_double_voting: TxDescriptor<Anonymize<I3pirohb0sp3ic>>;
    /**
     * Report voter equivocation/misbehavior. This method will verify the
     * equivocation proof and validate the given key ownership proof
     * against the extracted offender. If both are valid, the offence
     * will be reported.
     *
     * This extrinsic must be called unsigned and it is expected that only
     * block authors will call it (validated in `ValidateUnsigned`), as such
     * if the block author is defined it will be defined as the equivocation
     * reporter.
     */
    report_double_voting_unsigned: TxDescriptor<Anonymize<I3pirohb0sp3ic>>;
    /**
     * Reset BEEFY consensus by setting a new BEEFY genesis at `delay_in_blocks` blocks in the
     * future.
     *
     * Note: `delay_in_blocks` has to be at least 1.
     */
    set_new_genesis: TxDescriptor<Anonymize<Iemqna2uucuei9>>;
    /**
     * Report fork voting equivocation. This method will verify the equivocation proof
     * and validate the given key ownership proof against the extracted offender.
     * If both are valid, the offence will be reported.
     */
    report_fork_voting: TxDescriptor<Anonymize<Idrvp50hbkv2k2>>;
    /**
     * Report fork voting equivocation. This method will verify the equivocation proof
     * and validate the given key ownership proof against the extracted offender.
     * If both are valid, the offence will be reported.
     *
     * This extrinsic must be called unsigned and it is expected that only
     * block authors will call it (validated in `ValidateUnsigned`), as such
     * if the block author is defined it will be defined as the equivocation
     * reporter.
     */
    report_fork_voting_unsigned: TxDescriptor<Anonymize<Idrvp50hbkv2k2>>;
    /**
     * Report future block voting equivocation. This method will verify the equivocation proof
     * and validate the given key ownership proof against the extracted offender.
     * If both are valid, the offence will be reported.
     */
    report_future_block_voting: TxDescriptor<Anonymize<Ie11u326g2gsj3>>;
    /**
     * Report future block voting equivocation. This method will verify the equivocation proof
     * and validate the given key ownership proof against the extracted offender.
     * If both are valid, the offence will be reported.
     *
     * This extrinsic must be called unsigned and it is expected that only
     * block authors will call it (validated in `ValidateUnsigned`), as such
     * if the block author is defined it will be defined as the equivocation
     * reporter.
     */
    report_future_block_voting_unsigned: TxDescriptor<Anonymize<Ie11u326g2gsj3>>;
  };
};
type IEvent = {
  System: {
    /**
     * An extrinsic completed successfully.
     */
    ExtrinsicSuccess: PlainDescriptor<Anonymize<Ia82mnkmeo2rhc>>;
    /**
     * An extrinsic failed.
     */
    ExtrinsicFailed: PlainDescriptor<Anonymize<Idj4durc8hq327>>;
    /**
     * `:code` was updated.
     */
    CodeUpdated: PlainDescriptor<undefined>;
    /**
     * A new account was created.
     */
    NewAccount: PlainDescriptor<Anonymize<Icbccs0ug47ilf>>;
    /**
     * An account was reaped.
     */
    KilledAccount: PlainDescriptor<Anonymize<Icbccs0ug47ilf>>;
    /**
     * On on-chain remark happened.
     */
    Remarked: PlainDescriptor<Anonymize<I855j4i3kr8ko1>>;
    /**
     * An upgrade was authorized.
     */
    UpgradeAuthorized: PlainDescriptor<Anonymize<Ibgl04rn6nbfm6>>;
  };
  Indices: {
    /**
     * A account index was assigned.
     */
    IndexAssigned: PlainDescriptor<Anonymize<Ia1u3jll6a06ae>>;
    /**
     * A account index has been freed up (unassigned).
     */
    IndexFreed: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * A account index has been frozen to its current account ID.
     */
    IndexFrozen: PlainDescriptor<Anonymize<Ia1u3jll6a06ae>>;
  };
  Balances: {
    /**
     * An account was created with some free balance.
     */
    Endowed: PlainDescriptor<Anonymize<Icv68aq8841478>>;
    /**
     * An account was removed whose balance was non-zero but below ExistentialDeposit,
     * resulting in an outright loss.
     */
    DustLost: PlainDescriptor<Anonymize<Ic262ibdoec56a>>;
    /**
     * Transfer succeeded.
     */
    Transfer: PlainDescriptor<Anonymize<Iflcfm9b6nlmdd>>;
    /**
     * A balance was set by root.
     */
    BalanceSet: PlainDescriptor<Anonymize<Ijrsf4mnp3eka>>;
    /**
     * Some balance was reserved (moved from free to reserved).
     */
    Reserved: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some balance was unreserved (moved from reserved to free).
     */
    Unreserved: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some balance was moved from the reserve of the first account to the second account.
     * Final argument indicates the destination balance type.
     */
    ReserveRepatriated: PlainDescriptor<Anonymize<I8tjvj9uq4b7hi>>;
    /**
     * Some amount was deposited (e.g. for transaction fees).
     */
    Deposit: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some amount was withdrawn from the account (e.g. for transaction fees).
     */
    Withdraw: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some amount was removed from the account (e.g. for misbehavior).
     */
    Slashed: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some amount was minted into an account.
     */
    Minted: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some amount was burned from an account.
     */
    Burned: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some amount was suspended from an account (it can be restored later).
     */
    Suspended: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some amount was restored into an account.
     */
    Restored: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * An account was upgraded.
     */
    Upgraded: PlainDescriptor<Anonymize<I4cbvqmqadhrea>>;
    /**
     * Total issuance was increased by `amount`, creating a credit to be balanced.
     */
    Issued: PlainDescriptor<Anonymize<I3qt1hgg4djhgb>>;
    /**
     * Total issuance was decreased by `amount`, creating a debt to be balanced.
     */
    Rescinded: PlainDescriptor<Anonymize<I3qt1hgg4djhgb>>;
    /**
     * Some balance was locked.
     */
    Locked: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some balance was unlocked.
     */
    Unlocked: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some balance was frozen.
     */
    Frozen: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some balance was thawed.
     */
    Thawed: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * The `TotalIssuance` was forcefully changed.
     */
    TotalIssuanceForced: PlainDescriptor<Anonymize<I4fooe9dun9o0t>>;
  };
  TransactionPayment: {
    /**
     * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
     * has been paid by `who`.
     */
    TransactionFeePaid: PlainDescriptor<Anonymize<Ier2cke86dqbr2>>;
  };
  Staking: {
    /**
     * The era payout has been set; the first balance is the validator-payout; the second is
     * the remainder from the maximum amount of reward.
     */
    EraPaid: PlainDescriptor<Anonymize<I1au3fq4n84nv3>>;
    /**
     * The nominator has been rewarded by this amount to this destination.
     */
    Rewarded: PlainDescriptor<Anonymize<Iejaj7m7qka9tr>>;
    /**
     * A staker (validator or nominator) has been slashed by the given amount.
     */
    Slashed: PlainDescriptor<Anonymize<Idnak900lt5lm8>>;
    /**
     * A slash for the given validator, for the given percentage of their stake, at the given
     * era as been reported.
     */
    SlashReported: PlainDescriptor<Anonymize<I27n7lbd66730p>>;
    /**
     * An old slashing report from a prior era was discarded because it could
     * not be processed.
     */
    OldSlashingReportDiscarded: PlainDescriptor<Anonymize<I2hq50pu2kdjpo>>;
    /**
     * A new set of stakers was elected.
     */
    StakersElected: PlainDescriptor<undefined>;
    /**
     * An account has bonded this amount. \[stash, amount\]
     *
     * NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
     * it will not be emitted for staking rewards when they are added to stake.
     */
    Bonded: PlainDescriptor<Anonymize<Ifk8eme5o7mukf>>;
    /**
     * An account has unbonded this amount.
     */
    Unbonded: PlainDescriptor<Anonymize<Ifk8eme5o7mukf>>;
    /**
     * An account has called `withdraw_unbonded` and removed unbonding chunks worth `Balance`
     * from the unlocking queue.
     */
    Withdrawn: PlainDescriptor<Anonymize<Ifk8eme5o7mukf>>;
    /**
     * A nominator has been kicked from a validator.
     */
    Kicked: PlainDescriptor<Anonymize<Iau4cgm6ih61cf>>;
    /**
     * The election failed. No new era is planned.
     */
    StakingElectionFailed: PlainDescriptor<undefined>;
    /**
     * An account has stopped participating as either a validator or nominator.
     */
    Chilled: PlainDescriptor<Anonymize<Idl3umm12u5pa>>;
    /**
     * The stakers' rewards are getting paid.
     */
    PayoutStarted: PlainDescriptor<Anonymize<I6ir616rur362k>>;
    /**
     * A validator has set their preferences.
     */
    ValidatorPrefsSet: PlainDescriptor<Anonymize<Ic19as7nbst738>>;
    /**
     * Voters size limit reached.
     */
    SnapshotVotersSizeExceeded: PlainDescriptor<Anonymize<I54umskavgc9du>>;
    /**
     * Targets size limit reached.
     */
    SnapshotTargetsSizeExceeded: PlainDescriptor<Anonymize<I54umskavgc9du>>;
    /**
     * A new force era mode was set.
     */
    ForceEra: PlainDescriptor<Anonymize<I2ip7o9e2tc5sf>>;
    /**
     * Report of a controller batch deprecation.
     */
    ControllerBatchDeprecated: PlainDescriptor<Anonymize<I5egvk6hadac5h>>;
  };
  Offences: {
    /**
     * There is an offence reported of the given `kind` happened at the `session_index` and
     * (kind-specific) time slot. This event is not deposited for duplicate slashes.
     * \[kind, timeslot\].
     */
    Offence: PlainDescriptor<Anonymize<Iempvdlhc5ih6g>>;
  };
  Session: {
    /**
     * New session has happened. Note that the argument is the session index, not the
     * block number as the type might suggest.
     */
    NewSession: PlainDescriptor<Anonymize<I2hq50pu2kdjpo>>;
  };
  Grandpa: {
    /**
     * New authority set has been applied.
     */
    NewAuthorities: PlainDescriptor<Anonymize<I5768ac424h061>>;
    /**
     * Current authority set has been paused.
     */
    Paused: PlainDescriptor<undefined>;
    /**
     * Current authority set has been resumed.
     */
    Resumed: PlainDescriptor<undefined>;
  };
  Treasury: {
    /**
     * We have ended a spend period and will now allocate funds.
     */
    Spending: PlainDescriptor<Anonymize<I8iksqi3eani0a>>;
    /**
     * Some funds have been allocated.
     */
    Awarded: PlainDescriptor<Anonymize<I16enopmju1p0q>>;
    /**
     * Some of our funds have been burnt.
     */
    Burnt: PlainDescriptor<Anonymize<I43kq8qudg7pq9>>;
    /**
     * Spending has finished; this is the amount that rolls over until next spend.
     */
    Rollover: PlainDescriptor<Anonymize<I76riseemre533>>;
    /**
     * Some funds have been deposited.
     */
    Deposit: PlainDescriptor<Anonymize<Ie5v6njpckr05b>>;
    /**
     * A new spend proposal has been approved.
     */
    SpendApproved: PlainDescriptor<Anonymize<I38bmcrmh852rk>>;
    /**
     * The inactive funds of the pallet have been updated.
     */
    UpdatedInactive: PlainDescriptor<Anonymize<I4hcillge8de5f>>;
    /**
     * A new asset spend proposal has been approved.
     */
    AssetSpendApproved: PlainDescriptor<Anonymize<If52u7u3r3ve0n>>;
    /**
     * An approved spend was voided.
     */
    AssetSpendVoided: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * A payment happened.
     */
    Paid: PlainDescriptor<Anonymize<Iek7v4hrgnq6iv>>;
    /**
     * A payment failed and can be retried.
     */
    PaymentFailed: PlainDescriptor<Anonymize<Iek7v4hrgnq6iv>>;
    /**
     * A spend was processed and removed from the storage. It might have been successfully
     * paid or it may have expired.
     */
    SpendProcessed: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
  };
  ConvictionVoting: {
    /**
     * An account has delegated their vote to another account. \[who, target\]
     */
    Delegated: PlainDescriptor<Anonymize<I2na29tt2afp0j>>;
    /**
     * An \[account\] has cancelled a previous delegation operation.
     */
    Undelegated: PlainDescriptor<SS58String>;
    /**
     * An account that has voted
     */
    Voted: PlainDescriptor<Anonymize<I9qfchhljqsjjl>>;
    /**
     * A vote that been removed
     */
    VoteRemoved: PlainDescriptor<Anonymize<I9qfchhljqsjjl>>;
  };
  Referenda: {
    /**
     * A referendum has been submitted.
     */
    Submitted: PlainDescriptor<Anonymize<I229ijht536qdu>>;
    /**
     * The decision deposit has been placed.
     */
    DecisionDepositPlaced: PlainDescriptor<Anonymize<I62nte77gksm0f>>;
    /**
     * The decision deposit has been refunded.
     */
    DecisionDepositRefunded: PlainDescriptor<Anonymize<I62nte77gksm0f>>;
    /**
     * A deposit has been slashed.
     */
    DepositSlashed: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * A referendum has moved into the deciding phase.
     */
    DecisionStarted: PlainDescriptor<Anonymize<I9cg2delv92pvq>>;
    /**
        
         */
    ConfirmStarted: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
        
         */
    ConfirmAborted: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * A referendum has ended its confirmation phase and is ready for approval.
     */
    Confirmed: PlainDescriptor<Anonymize<Ilhp45uime5tp>>;
    /**
     * A referendum has been approved and its proposal has been scheduled.
     */
    Approved: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * A proposal has been rejected by referendum.
     */
    Rejected: PlainDescriptor<Anonymize<Ilhp45uime5tp>>;
    /**
     * A referendum has been timed out without being decided.
     */
    TimedOut: PlainDescriptor<Anonymize<Ilhp45uime5tp>>;
    /**
     * A referendum has been cancelled.
     */
    Cancelled: PlainDescriptor<Anonymize<Ilhp45uime5tp>>;
    /**
     * A referendum has been killed.
     */
    Killed: PlainDescriptor<Anonymize<Ilhp45uime5tp>>;
    /**
     * The submission deposit has been refunded.
     */
    SubmissionDepositRefunded: PlainDescriptor<Anonymize<I62nte77gksm0f>>;
    /**
     * Metadata for a referendum has been set.
     */
    MetadataSet: PlainDescriptor<Anonymize<I4f1hv034jf1dt>>;
    /**
     * Metadata for a referendum has been cleared.
     */
    MetadataCleared: PlainDescriptor<Anonymize<I4f1hv034jf1dt>>;
  };
  FellowshipCollective: {
    /**
     * A member `who` has been added.
     */
    MemberAdded: PlainDescriptor<Anonymize<I4cbvqmqadhrea>>;
    /**
     * The member `who`se rank has been changed to the given `rank`.
     */
    RankChanged: PlainDescriptor<Anonymize<Im1pm2vf6llcn>>;
    /**
     * The member `who` of given `rank` has been removed from the collective.
     */
    MemberRemoved: PlainDescriptor<Anonymize<Im1pm2vf6llcn>>;
    /**
     * The member `who` has voted for the `poll` with the given `vote` leading to an updated
     * `tally`.
     */
    Voted: PlainDescriptor<Anonymize<I21jsoeb0o6476>>;
    /**
     * The member `who` had their `AccountId` changed to `new_who`.
     */
    MemberExchanged: PlainDescriptor<Anonymize<Ier6ck0tpfo7>>;
  };
  FellowshipReferenda: {
    /**
     * A referendum has been submitted.
     */
    Submitted: PlainDescriptor<Anonymize<I229ijht536qdu>>;
    /**
     * The decision deposit has been placed.
     */
    DecisionDepositPlaced: PlainDescriptor<Anonymize<I62nte77gksm0f>>;
    /**
     * The decision deposit has been refunded.
     */
    DecisionDepositRefunded: PlainDescriptor<Anonymize<I62nte77gksm0f>>;
    /**
     * A deposit has been slashed.
     */
    DepositSlashed: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * A referendum has moved into the deciding phase.
     */
    DecisionStarted: PlainDescriptor<Anonymize<Ic6ecdcp9ut7jd>>;
    /**
        
         */
    ConfirmStarted: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
        
         */
    ConfirmAborted: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * A referendum has ended its confirmation phase and is ready for approval.
     */
    Confirmed: PlainDescriptor<Anonymize<I27notaksll8qt>>;
    /**
     * A referendum has been approved and its proposal has been scheduled.
     */
    Approved: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * A proposal has been rejected by referendum.
     */
    Rejected: PlainDescriptor<Anonymize<I27notaksll8qt>>;
    /**
     * A referendum has been timed out without being decided.
     */
    TimedOut: PlainDescriptor<Anonymize<I27notaksll8qt>>;
    /**
     * A referendum has been cancelled.
     */
    Cancelled: PlainDescriptor<Anonymize<I27notaksll8qt>>;
    /**
     * A referendum has been killed.
     */
    Killed: PlainDescriptor<Anonymize<I27notaksll8qt>>;
    /**
     * The submission deposit has been refunded.
     */
    SubmissionDepositRefunded: PlainDescriptor<Anonymize<I62nte77gksm0f>>;
    /**
     * Metadata for a referendum has been set.
     */
    MetadataSet: PlainDescriptor<Anonymize<I4f1hv034jf1dt>>;
    /**
     * Metadata for a referendum has been cleared.
     */
    MetadataCleared: PlainDescriptor<Anonymize<I4f1hv034jf1dt>>;
  };
  Whitelist: {
    /**
        
         */
    CallWhitelisted: PlainDescriptor<Anonymize<I1adbcfi5uc62r>>;
    /**
        
         */
    WhitelistedCallRemoved: PlainDescriptor<Anonymize<I1adbcfi5uc62r>>;
    /**
        
         */
    WhitelistedCallDispatched: PlainDescriptor<Anonymize<I43hb96cjhbuft>>;
  };
  Parameters: {
    /**
     * A Parameter was set.
     *
     * Is also emitted when the value was not changed.
     */
    Updated: PlainDescriptor<Anonymize<I6nr1tkv231n8k>>;
  };
  Claims: {
    /**
     * Someone claimed some DOTs.
     */
    Claimed: PlainDescriptor<Anonymize<Ie3hcrrq6r18fs>>;
  };
  Utility: {
    /**
     * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
     * well as the error.
     */
    BatchInterrupted: PlainDescriptor<Anonymize<I3ukv7eis0l0rp>>;
    /**
     * Batch of dispatches completed fully with no error.
     */
    BatchCompleted: PlainDescriptor<undefined>;
    /**
     * Batch of dispatches completed but has errors.
     */
    BatchCompletedWithErrors: PlainDescriptor<undefined>;
    /**
     * A single item within a Batch of dispatches has completed with no error.
     */
    ItemCompleted: PlainDescriptor<undefined>;
    /**
     * A single item within a Batch of dispatches has completed with error.
     */
    ItemFailed: PlainDescriptor<Anonymize<I8s7sjg2dqn1fq>>;
    /**
     * A call was dispatched.
     */
    DispatchedAs: PlainDescriptor<Anonymize<I9s9use9eb8ti8>>;
  };
  Society: {
    /**
     * The society is founded by the given identity.
     */
    Founded: PlainDescriptor<Anonymize<I8ircspqpe79k7>>;
    /**
     * A membership bid just happened. The given account is the candidate's ID and their offer
     * is the second.
     */
    Bid: PlainDescriptor<Anonymize<I1vlt8l6nvnen6>>;
    /**
     * A membership bid just happened by vouching. The given account is the candidate's ID and
     * their offer is the second. The vouching party is the third.
     */
    Vouch: PlainDescriptor<Anonymize<I72vf0j9juc1df>>;
    /**
     * A candidate was dropped (due to an excess of bids in the system).
     */
    AutoUnbid: PlainDescriptor<Anonymize<I4b66js88p45m8>>;
    /**
     * A candidate was dropped (by their request).
     */
    Unbid: PlainDescriptor<Anonymize<I4b66js88p45m8>>;
    /**
     * A candidate was dropped (by request of who vouched for them).
     */
    Unvouch: PlainDescriptor<Anonymize<I4b66js88p45m8>>;
    /**
     * A group of candidates have been inducted. The batch's primary is the first value, the
     * batch in full is the second.
     */
    Inducted: PlainDescriptor<Anonymize<Ie0phfcvllr4od>>;
    /**
     * A suspended member has been judged.
     */
    SuspendedMemberJudgement: PlainDescriptor<Anonymize<I476ep66p6ddg1>>;
    /**
     * A candidate has been suspended
     */
    CandidateSuspended: PlainDescriptor<Anonymize<I4b66js88p45m8>>;
    /**
     * A member has been suspended
     */
    MemberSuspended: PlainDescriptor<Anonymize<Ie3gphha4ejh40>>;
    /**
     * A member has been challenged
     */
    Challenged: PlainDescriptor<Anonymize<Ie3gphha4ejh40>>;
    /**
     * A vote has been placed
     */
    Vote: PlainDescriptor<Anonymize<If0btdsid69rrm>>;
    /**
     * A vote has been placed for a defending member
     */
    DefenderVote: PlainDescriptor<Anonymize<Ictusacdcqj61u>>;
    /**
     * A new set of \[params\] has been set for the group.
     */
    NewParams: PlainDescriptor<Anonymize<Ibsolu3c3q1lb4>>;
    /**
     * Society is unfounded.
     */
    Unfounded: PlainDescriptor<Anonymize<I8ircspqpe79k7>>;
    /**
     * Some funds were deposited into the society account.
     */
    Deposit: PlainDescriptor<Anonymize<Ie5v6njpckr05b>>;
    /**
     * A \[member\] got elevated to \[rank\].
     */
    Elevated: PlainDescriptor<Anonymize<Ib116djgo9u4uo>>;
  };
  Recovery: {
    /**
     * A recovery process has been set up for an account.
     */
    RecoveryCreated: PlainDescriptor<Anonymize<Icbccs0ug47ilf>>;
    /**
     * A recovery process has been initiated for lost account by rescuer account.
     */
    RecoveryInitiated: PlainDescriptor<Anonymize<I9vkkue6cq74et>>;
    /**
     * A recovery process for lost account by rescuer account has been vouched for by sender.
     */
    RecoveryVouched: PlainDescriptor<Anonymize<Ibu56t5h1q49i4>>;
    /**
     * A recovery process for lost account by rescuer account has been closed.
     */
    RecoveryClosed: PlainDescriptor<Anonymize<I9vkkue6cq74et>>;
    /**
     * Lost account has been successfully recovered by rescuer account.
     */
    AccountRecovered: PlainDescriptor<Anonymize<I9vkkue6cq74et>>;
    /**
     * A recovery process has been removed for an account.
     */
    RecoveryRemoved: PlainDescriptor<Anonymize<I1dmtl5t34b9g>>;
  };
  Vesting: {
    /**
     * The amount vested has been updated. This could indicate a change in funds available.
     * The balance given is the amount which is left unvested (and thus locked).
     */
    VestingUpdated: PlainDescriptor<Anonymize<Ievr89968437gm>>;
    /**
     * An \[account\] has become fully vested.
     */
    VestingCompleted: PlainDescriptor<Anonymize<Icbccs0ug47ilf>>;
  };
  Scheduler: {
    /**
     * Scheduled some task.
     */
    Scheduled: PlainDescriptor<Anonymize<I5n4sebgkfr760>>;
    /**
     * Canceled some task.
     */
    Canceled: PlainDescriptor<Anonymize<I5n4sebgkfr760>>;
    /**
     * Dispatched some task.
     */
    Dispatched: PlainDescriptor<Anonymize<I25vntc99qsnov>>;
    /**
     * Set a retry configuration for some task.
     */
    RetrySet: PlainDescriptor<Anonymize<Ia3c82eadg79bj>>;
    /**
     * Cancel a retry configuration for some task.
     */
    RetryCancelled: PlainDescriptor<Anonymize<Ienusoeb625ftq>>;
    /**
     * The call for the provided hash was not found so the task has been aborted.
     */
    CallUnavailable: PlainDescriptor<Anonymize<Ienusoeb625ftq>>;
    /**
     * The given task was unable to be renewed since the agenda is full at that block.
     */
    PeriodicFailed: PlainDescriptor<Anonymize<Ienusoeb625ftq>>;
    /**
     * The given task was unable to be retried since the agenda is full at that block or there
     * was not enough weight to reschedule it.
     */
    RetryFailed: PlainDescriptor<Anonymize<Ienusoeb625ftq>>;
    /**
     * The given task can never be executed since it is overweight.
     */
    PermanentlyOverweight: PlainDescriptor<Anonymize<Ienusoeb625ftq>>;
  };
  Proxy: {
    /**
     * A proxy was executed correctly, with the given.
     */
    ProxyExecuted: PlainDescriptor<Anonymize<I9s9use9eb8ti8>>;
    /**
     * A pure account has been created by new proxy with given
     * disambiguation index and proxy type.
     */
    PureCreated: PlainDescriptor<Anonymize<Iub732oamcqd>>;
    /**
     * An announcement was placed to make a call in the future.
     */
    Announced: PlainDescriptor<Anonymize<I2ur0oeqg495j8>>;
    /**
     * A proxy was added.
     */
    ProxyAdded: PlainDescriptor<Anonymize<Ibddqkipr41dmk>>;
    /**
     * A proxy was removed.
     */
    ProxyRemoved: PlainDescriptor<Anonymize<Ibddqkipr41dmk>>;
  };
  Multisig: {
    /**
     * A new multisig operation has begun.
     */
    NewMultisig: PlainDescriptor<Anonymize<Iep27ialq4a7o7>>;
    /**
     * A multisig operation has been approved by someone.
     */
    MultisigApproval: PlainDescriptor<Anonymize<Iasu5jvoqr43mv>>;
    /**
     * A multisig operation has been executed.
     */
    MultisigExecuted: PlainDescriptor<Anonymize<I4q4crqi176q3k>>;
    /**
     * A multisig operation has been cancelled.
     */
    MultisigCancelled: PlainDescriptor<Anonymize<I5qolde99acmd1>>;
  };
  Preimage: {
    /**
     * A preimage has been noted.
     */
    Noted: PlainDescriptor<Anonymize<I1jm8m1rh9e20v>>;
    /**
     * A preimage has been requested.
     */
    Requested: PlainDescriptor<Anonymize<I1jm8m1rh9e20v>>;
    /**
     * A preimage has ben cleared.
     */
    Cleared: PlainDescriptor<Anonymize<I1jm8m1rh9e20v>>;
  };
  Bounties: {
    /**
     * New bounty proposal.
     */
    BountyProposed: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * A bounty proposal was rejected; funds were slashed.
     */
    BountyRejected: PlainDescriptor<Anonymize<Id9idaj83175f9>>;
    /**
     * A bounty proposal is funded and became active.
     */
    BountyBecameActive: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * A bounty is awarded to a beneficiary.
     */
    BountyAwarded: PlainDescriptor<Anonymize<Ie1semicfuv5uu>>;
    /**
     * A bounty is claimed by beneficiary.
     */
    BountyClaimed: PlainDescriptor<Anonymize<If25fjs9o37co1>>;
    /**
     * A bounty is cancelled.
     */
    BountyCanceled: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * A bounty expiry is extended.
     */
    BountyExtended: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * A bounty is approved.
     */
    BountyApproved: PlainDescriptor<Anonymize<I666bl2fqjkejo>>;
    /**
     * A bounty curator is proposed.
     */
    CuratorProposed: PlainDescriptor<Anonymize<I70sc1pdo8vtos>>;
    /**
     * A bounty curator is unassigned.
     */
    CuratorUnassigned: PlainDescriptor<Anonymize<Ia9p5bg6p18r0i>>;
    /**
     * A bounty curator is accepted.
     */
    CuratorAccepted: PlainDescriptor<Anonymize<I70sc1pdo8vtos>>;
  };
  ChildBounties: {
    /**
     * A child-bounty is added.
     */
    Added: PlainDescriptor<Anonymize<I60p8l86a8cm59>>;
    /**
     * A child-bounty is awarded to a beneficiary.
     */
    Awarded: PlainDescriptor<Anonymize<I3m3sk2lgcabvp>>;
    /**
     * A child-bounty is claimed by beneficiary.
     */
    Claimed: PlainDescriptor<Anonymize<I5pf572duh4oeg>>;
    /**
     * A child-bounty is cancelled.
     */
    Canceled: PlainDescriptor<Anonymize<I60p8l86a8cm59>>;
  };
  ElectionProviderMultiPhase: {
    /**
     * A solution was stored with the given compute.
     *
     * The `origin` indicates the origin of the solution. If `origin` is `Some(AccountId)`,
     * the stored solution was submitted in the signed phase by a miner with the `AccountId`.
     * Otherwise, the solution was stored either during the unsigned phase or by
     * `T::ForceOrigin`. The `bool` is `true` when a previous solution was ejected to make
     * room for this one.
     */
    SolutionStored: PlainDescriptor<Anonymize<I4mol6k10mv0io>>;
    /**
     * The election has been finalized, with the given computation and score.
     */
    ElectionFinalized: PlainDescriptor<Anonymize<Iec90vukseit9e>>;
    /**
     * An election failed.
     *
     * Not much can be said about which computes failed in the process.
     */
    ElectionFailed: PlainDescriptor<undefined>;
    /**
     * An account has been rewarded for their signed submission being finalized.
     */
    Rewarded: PlainDescriptor<Anonymize<I7j4m7a3pkvsf4>>;
    /**
     * An account has been slashed for submitting an invalid signed submission.
     */
    Slashed: PlainDescriptor<Anonymize<I7j4m7a3pkvsf4>>;
    /**
     * There was a phase transition in a given round.
     */
    PhaseTransitioned: PlainDescriptor<Anonymize<Ic2n50kpnu5mae>>;
  };
  Nis: {
    /**
     * A bid was successfully placed.
     */
    BidPlaced: PlainDescriptor<Anonymize<Ie2vmgag6qiue4>>;
    /**
     * A bid was successfully removed (before being accepted).
     */
    BidRetracted: PlainDescriptor<Anonymize<Ie2vmgag6qiue4>>;
    /**
     * A bid was dropped from a queue because of another, more substantial, bid was present.
     */
    BidDropped: PlainDescriptor<Anonymize<Ie2vmgag6qiue4>>;
    /**
     * A bid was accepted. The balance may not be released until expiry.
     */
    Issued: PlainDescriptor<Anonymize<I1kpuet4lkcdpf>>;
    /**
     * An receipt has been (at least partially) thawed.
     */
    Thawed: PlainDescriptor<Anonymize<I5tr1gp2t9i6oh>>;
    /**
     * An automatic funding of the deficit was made.
     */
    Funded: PlainDescriptor<Anonymize<I7ls1r4u61csif>>;
    /**
     * A receipt was transferred.
     */
    Transferred: PlainDescriptor<Anonymize<I3gjgtso69eopr>>;
  };
  NisCounterpartBalances: {
    /**
     * An account was created with some free balance.
     */
    Endowed: PlainDescriptor<Anonymize<Icv68aq8841478>>;
    /**
     * An account was removed whose balance was non-zero but below ExistentialDeposit,
     * resulting in an outright loss.
     */
    DustLost: PlainDescriptor<Anonymize<Ic262ibdoec56a>>;
    /**
     * Transfer succeeded.
     */
    Transfer: PlainDescriptor<Anonymize<Iflcfm9b6nlmdd>>;
    /**
     * A balance was set by root.
     */
    BalanceSet: PlainDescriptor<Anonymize<Ijrsf4mnp3eka>>;
    /**
     * Some balance was reserved (moved from free to reserved).
     */
    Reserved: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some balance was unreserved (moved from reserved to free).
     */
    Unreserved: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some balance was moved from the reserve of the first account to the second account.
     * Final argument indicates the destination balance type.
     */
    ReserveRepatriated: PlainDescriptor<Anonymize<I8tjvj9uq4b7hi>>;
    /**
     * Some amount was deposited (e.g. for transaction fees).
     */
    Deposit: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some amount was withdrawn from the account (e.g. for transaction fees).
     */
    Withdraw: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some amount was removed from the account (e.g. for misbehavior).
     */
    Slashed: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some amount was minted into an account.
     */
    Minted: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some amount was burned from an account.
     */
    Burned: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some amount was suspended from an account (it can be restored later).
     */
    Suspended: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some amount was restored into an account.
     */
    Restored: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * An account was upgraded.
     */
    Upgraded: PlainDescriptor<Anonymize<I4cbvqmqadhrea>>;
    /**
     * Total issuance was increased by `amount`, creating a credit to be balanced.
     */
    Issued: PlainDescriptor<Anonymize<I3qt1hgg4djhgb>>;
    /**
     * Total issuance was decreased by `amount`, creating a debt to be balanced.
     */
    Rescinded: PlainDescriptor<Anonymize<I3qt1hgg4djhgb>>;
    /**
     * Some balance was locked.
     */
    Locked: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some balance was unlocked.
     */
    Unlocked: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some balance was frozen.
     */
    Frozen: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * Some balance was thawed.
     */
    Thawed: PlainDescriptor<Anonymize<Id5fm4p8lj5qgi>>;
    /**
     * The `TotalIssuance` was forcefully changed.
     */
    TotalIssuanceForced: PlainDescriptor<Anonymize<I4fooe9dun9o0t>>;
  };
  VoterList: {
    /**
     * Moved an account from one bag to another.
     */
    Rebagged: PlainDescriptor<Anonymize<I37454vatvmm1l>>;
    /**
     * Updated the score of some account to the given amount.
     */
    ScoreUpdated: PlainDescriptor<Anonymize<Iblau1qa7u7fet>>;
  };
  NominationPools: {
    /**
     * A pool has been created.
     */
    Created: PlainDescriptor<Anonymize<I1ti389kf8t6oi>>;
    /**
     * A member has became bonded in a pool.
     */
    Bonded: PlainDescriptor<Anonymize<If4nnre373amul>>;
    /**
     * A payout has been made to a member.
     */
    PaidOut: PlainDescriptor<Anonymize<I55kbor0ocqk6h>>;
    /**
     * A member has unbonded from their pool.
     *
     * - `balance` is the corresponding balance of the number of points that has been
     * requested to be unbonded (the argument of the `unbond` transaction) from the bonded
     * pool.
     * - `points` is the number of points that are issued as a result of `balance` being
     * dissolved into the corresponding unbonding pool.
     * - `era` is the era in which the balance will be unbonded.
     * In the absence of slashing, these values will match. In the presence of slashing, the
     * number of points that are issued in the unbonding pool will be less than the amount
     * requested to be unbonded.
     */
    Unbonded: PlainDescriptor<Anonymize<Idsj9cg7j96kpc>>;
    /**
     * A member has withdrawn from their pool.
     *
     * The given number of `points` have been dissolved in return of `balance`.
     *
     * Similar to `Unbonded` event, in the absence of slashing, the ratio of point to balance
     * will be 1.
     */
    Withdrawn: PlainDescriptor<Anonymize<Ido4u9drncfaml>>;
    /**
     * A pool has been destroyed.
     */
    Destroyed: PlainDescriptor<Anonymize<I931cottvong90>>;
    /**
     * The state of a pool has changed
     */
    StateChanged: PlainDescriptor<Anonymize<Ie8c7ctks8ur2p>>;
    /**
     * A member has been removed from a pool.
     *
     * The removal can be voluntary (withdrawn all unbonded funds) or involuntary (kicked).
     * Any funds that are still delegated (i.e. dangling delegation) are released and are
     * represented by `released_balance`.
     */
    MemberRemoved: PlainDescriptor<Anonymize<I6c6fpqmnqijqd>>;
    /**
     * The roles of a pool have been updated to the given new roles. Note that the depositor
     * can never change.
     */
    RolesUpdated: PlainDescriptor<Anonymize<I6mik29s5073td>>;
    /**
     * The active balance of pool `pool_id` has been slashed to `balance`.
     */
    PoolSlashed: PlainDescriptor<Anonymize<I2m0sqmb75cnpb>>;
    /**
     * The unbond pool at `era` of pool `pool_id` has been slashed to `balance`.
     */
    UnbondingPoolSlashed: PlainDescriptor<Anonymize<I49agc5b62mehu>>;
    /**
     * A pool's commission setting has been changed.
     */
    PoolCommissionUpdated: PlainDescriptor<Anonymize<Iatq9jda4hq6pg>>;
    /**
     * A pool's maximum commission setting has been changed.
     */
    PoolMaxCommissionUpdated: PlainDescriptor<Anonymize<I8cbluptqo8kbp>>;
    /**
     * A pool's commission `change_rate` has been changed.
     */
    PoolCommissionChangeRateUpdated: PlainDescriptor<Anonymize<I81cc4plffa1dm>>;
    /**
     * Pool commission claim permission has been updated.
     */
    PoolCommissionClaimPermissionUpdated: PlainDescriptor<Anonymize<I3ihan8icf0c5k>>;
    /**
     * Pool commission has been claimed.
     */
    PoolCommissionClaimed: PlainDescriptor<Anonymize<I2g87evcjlgmqi>>;
    /**
     * Topped up deficit in frozen ED of the reward pool.
     */
    MinBalanceDeficitAdjusted: PlainDescriptor<Anonymize<Ieg1oc56mamrl5>>;
    /**
     * Claimed excess frozen ED of af the reward pool.
     */
    MinBalanceExcessAdjusted: PlainDescriptor<Anonymize<Ieg1oc56mamrl5>>;
  };
  FastUnstake: {
    /**
     * A staker was unstaked.
     */
    Unstaked: PlainDescriptor<Anonymize<I1l21nt7d25tem>>;
    /**
     * A staker was slashed for requesting fast-unstake whilst being exposed.
     */
    Slashed: PlainDescriptor<Anonymize<Ifk8eme5o7mukf>>;
    /**
     * A batch was partially checked for the given eras, but the process did not finish.
     */
    BatchChecked: PlainDescriptor<Anonymize<Ic0he9tlf9ll0u>>;
    /**
     * A batch of a given size was terminated.
     *
     * This is always follows by a number of `Unstaked` or `Slashed` events, marking the end
     * of the batch. A new batch will be created upon next block.
     */
    BatchFinished: PlainDescriptor<Anonymize<I54umskavgc9du>>;
    /**
     * An internal error happened. Operations will be paused now.
     */
    InternalError: PlainDescriptor<undefined>;
  };
  DelegatedStaking: {
    /**
     * Funds delegated by a delegator.
     */
    Delegated: PlainDescriptor<Anonymize<Id2aanom2jncf1>>;
    /**
     * Funds released to a delegator.
     */
    Released: PlainDescriptor<Anonymize<Id2aanom2jncf1>>;
    /**
     * Funds slashed from a delegator.
     */
    Slashed: PlainDescriptor<Anonymize<Id2aanom2jncf1>>;
    /**
     * Unclaimed delegation funds migrated to delegator.
     */
    MigratedDelegation: PlainDescriptor<Anonymize<Id2aanom2jncf1>>;
  };
  ParaInclusion: {
    /**
     * A candidate was backed. `[candidate, head_data]`
     */
    CandidateBacked: PlainDescriptor<Anonymize<Icdu1nb48l753j>>;
    /**
     * A candidate was included. `[candidate, head_data]`
     */
    CandidateIncluded: PlainDescriptor<Anonymize<Icdu1nb48l753j>>;
    /**
     * A candidate timed out. `[candidate, head_data]`
     */
    CandidateTimedOut: PlainDescriptor<Anonymize<I618m2uag0aopg>>;
    /**
     * Some upward messages have been received and will be processed.
     */
    UpwardMessagesReceived: PlainDescriptor<Anonymize<Ic8i89mfkmn3n7>>;
  };
  Paras: {
    /**
     * Current code has been updated for a Para. `para_id`
     */
    CurrentCodeUpdated: PlainDescriptor<number>;
    /**
     * Current head has been updated for a Para. `para_id`
     */
    CurrentHeadUpdated: PlainDescriptor<number>;
    /**
     * A code upgrade has been scheduled for a Para. `para_id`
     */
    CodeUpgradeScheduled: PlainDescriptor<number>;
    /**
     * A new head has been noted for a Para. `para_id`
     */
    NewHeadNoted: PlainDescriptor<number>;
    /**
     * A para has been queued to execute pending actions. `para_id`
     */
    ActionQueued: PlainDescriptor<Anonymize<I9jd27rnpm8ttv>>;
    /**
     * The given para either initiated or subscribed to a PVF check for the given validation
     * code. `code_hash` `para_id`
     */
    PvfCheckStarted: PlainDescriptor<Anonymize<I4pact7n2e9a0i>>;
    /**
     * The given validation code was accepted by the PVF pre-checking vote.
     * `code_hash` `para_id`
     */
    PvfCheckAccepted: PlainDescriptor<Anonymize<I4pact7n2e9a0i>>;
    /**
     * The given validation code was rejected by the PVF pre-checking vote.
     * `code_hash` `para_id`
     */
    PvfCheckRejected: PlainDescriptor<Anonymize<I4pact7n2e9a0i>>;
  };
  Hrmp: {
    /**
     * Open HRMP channel requested.
     */
    OpenChannelRequested: PlainDescriptor<Anonymize<Id2bej717ckub0>>;
    /**
     * An HRMP channel request sent by the receiver was canceled by either party.
     */
    OpenChannelCanceled: PlainDescriptor<Anonymize<I545vo2e86o5i4>>;
    /**
     * Open HRMP channel accepted.
     */
    OpenChannelAccepted: PlainDescriptor<Anonymize<I50mrcbubp554e>>;
    /**
     * HRMP channel closed.
     */
    ChannelClosed: PlainDescriptor<Anonymize<I545vo2e86o5i4>>;
    /**
     * An HRMP channel was opened via Root origin.
     */
    HrmpChannelForceOpened: PlainDescriptor<Anonymize<Id2bej717ckub0>>;
    /**
     * An HRMP channel was opened with a system chain.
     */
    HrmpSystemChannelOpened: PlainDescriptor<Anonymize<Id2bej717ckub0>>;
    /**
     * An HRMP channel's deposits were updated.
     */
    OpenChannelDepositsUpdated: PlainDescriptor<Anonymize<I50mrcbubp554e>>;
  };
  ParasDisputes: {
    /**
     * A dispute has been initiated. \[candidate hash, dispute location\]
     */
    DisputeInitiated: PlainDescriptor<Anonymize<I3i09nus3ku37s>>;
    /**
     * A dispute has concluded for or against a candidate.
     * `\[para id, candidate hash, dispute result\]`
     */
    DisputeConcluded: PlainDescriptor<Anonymize<I2e447aa6a0imh>>;
    /**
     * A dispute has concluded with supermajority against a candidate.
     * Block authors should no longer build on top of this head and should
     * instead revert the block at the given height. This should be the
     * number of the child of the last known valid block in the chain.
     */
    Revert: PlainDescriptor<number>;
  };
  OnDemandAssignmentProvider: {
    /**
     * An order was placed at some spot price amount by orderer ordered_by
     */
    OnDemandOrderPlaced: PlainDescriptor<Anonymize<I82n7gg49bvucn>>;
    /**
     * The value of the spot price has likely changed
     */
    SpotPriceSet: PlainDescriptor<Anonymize<I58qkru548f7dl>>;
  };
  Registrar: {
    /**
        
         */
    Registered: PlainDescriptor<Anonymize<Ibs22tt76qp5bi>>;
    /**
        
         */
    Deregistered: PlainDescriptor<Anonymize<I37r4bdai8o9mp>>;
    /**
        
         */
    Reserved: PlainDescriptor<Anonymize<Idn2ghub1o4i40>>;
    /**
        
         */
    Swapped: PlainDescriptor<Anonymize<I48u78djt89dod>>;
  };
  Slots: {
    /**
     * A new `[lease_period]` is beginning.
     */
    NewLeasePeriod: PlainDescriptor<Anonymize<Ib85m5kfbepu2t>>;
    /**
     * A para has won the right to a continuous set of lease periods as a parachain.
     * First balance is any extra amount reserved on top of the para's existing deposit.
     * Second balance is the total amount reserved.
     */
    Leased: PlainDescriptor<Anonymize<Idaml5bdhsfcsl>>;
  };
  Auctions: {
    /**
     * An auction started. Provides its index and the block number where it will begin to
     * close and the first lease period of the quadruplet that is auctioned.
     */
    AuctionStarted: PlainDescriptor<Anonymize<Ieec0cu336gteb>>;
    /**
     * An auction ended. All funds become unreserved.
     */
    AuctionClosed: PlainDescriptor<Anonymize<I815d5k4ij85nv>>;
    /**
     * Funds were reserved for a winning bid. First balance is the extra amount reserved.
     * Second is the total.
     */
    Reserved: PlainDescriptor<Anonymize<Ifi98fgi9o46v7>>;
    /**
     * Funds were unreserved since bidder is no longer active. `[bidder, amount]`
     */
    Unreserved: PlainDescriptor<Anonymize<Ic0oj9tok33uap>>;
    /**
     * Someone attempted to lease the same slot twice for a parachain. The amount is held in
     * reserve but no parachain slot has been leased.
     */
    ReserveConfiscated: PlainDescriptor<Anonymize<I3tdutpfjuk32j>>;
    /**
     * A new bid has been accepted as the current winner.
     */
    BidAccepted: PlainDescriptor<Anonymize<I1esdujrkdacpb>>;
    /**
     * The winning offset was chosen for an auction. This will map into the `Winning` storage
     * map.
     */
    WinningOffset: PlainDescriptor<Anonymize<I9g1d820jf9m2s>>;
  };
  Crowdloan: {
    /**
     * Create a new crowdloaning campaign.
     */
    Created: PlainDescriptor<Anonymize<I37r4bdai8o9mp>>;
    /**
     * Contributed to a crowd sale.
     */
    Contributed: PlainDescriptor<Anonymize<I8ve4g3egaln6a>>;
    /**
     * Withdrew full balance of a contributor.
     */
    Withdrew: PlainDescriptor<Anonymize<I8ve4g3egaln6a>>;
    /**
     * The loans in a fund have been partially dissolved, i.e. there are some left
     * over child keys that still need to be killed.
     */
    PartiallyRefunded: PlainDescriptor<Anonymize<I37r4bdai8o9mp>>;
    /**
     * All loans in a fund have been refunded.
     */
    AllRefunded: PlainDescriptor<Anonymize<I37r4bdai8o9mp>>;
    /**
     * Fund is dissolved.
     */
    Dissolved: PlainDescriptor<Anonymize<I37r4bdai8o9mp>>;
    /**
     * The result of trying to submit a new bid to the Slots pallet.
     */
    HandleBidResult: PlainDescriptor<Anonymize<I99vdr7gapai98>>;
    /**
     * The configuration to a crowdloan has been edited.
     */
    Edited: PlainDescriptor<Anonymize<I37r4bdai8o9mp>>;
    /**
     * A memo has been updated.
     */
    MemoUpdated: PlainDescriptor<Anonymize<If4hvqaeoqq5us>>;
    /**
     * A parachain has been moved to `NewRaise`
     */
    AddedToNewRaise: PlainDescriptor<Anonymize<I37r4bdai8o9mp>>;
  };
  Coretime: {
    /**
     * The broker chain has asked for revenue information for a specific block.
     */
    RevenueInfoRequested: PlainDescriptor<Anonymize<Ibtsa3docbr9el>>;
    /**
     * A core has received a new assignment from the broker chain.
     */
    CoreAssigned: PlainDescriptor<Anonymize<Iaiqv5prlisjkg>>;
  };
  XcmPallet: {
    /**
     * Execution of an XCM message was attempted.
     */
    Attempted: PlainDescriptor<Anonymize<I2aatv5i0cb96a>>;
    /**
     * A XCM message was sent.
     */
    Sent: PlainDescriptor<Anonymize<Ib9msr5sr8t3dn>>;
    /**
     * Query response received which does not match a registered query. This may be because a
     * matching query was never registered, it may be because it is a duplicate response, or
     * because the query timed out.
     */
    UnexpectedResponse: PlainDescriptor<Anonymize<I3le5tr7ugg6l2>>;
    /**
     * Query response has been received and is ready for taking with `take_response`. There is
     * no registered notification call.
     */
    ResponseReady: PlainDescriptor<Anonymize<I3iun9sig164po>>;
    /**
     * Query response has been received and query is removed. The registered notification has
     * been dispatched and executed successfully.
     */
    Notified: PlainDescriptor<Anonymize<I2uqmls7kcdnii>>;
    /**
     * Query response has been received and query is removed. The registered notification
     * could not be dispatched because the dispatch weight is greater than the maximum weight
     * originally budgeted by this runtime for the query result.
     */
    NotifyOverweight: PlainDescriptor<Anonymize<Idg69klialbkb8>>;
    /**
     * Query response has been received and query is removed. There was a general error with
     * dispatching the notification call.
     */
    NotifyDispatchError: PlainDescriptor<Anonymize<I2uqmls7kcdnii>>;
    /**
     * Query response has been received and query is removed. The dispatch was unable to be
     * decoded into a `Call`; this might be due to dispatch function having a signature which
     * is not `(origin, QueryId, Response)`.
     */
    NotifyDecodeFailed: PlainDescriptor<Anonymize<I2uqmls7kcdnii>>;
    /**
     * Expected query response has been received but the origin location of the response does
     * not match that expected. The query remains registered for a later, valid, response to
     * be received and acted upon.
     */
    InvalidResponder: PlainDescriptor<Anonymize<I13jboebjcbglr>>;
    /**
     * Expected query response has been received but the expected origin location placed in
     * storage by this runtime previously cannot be decoded. The query remains registered.
     *
     * This is unexpected (since a location placed in storage in a previously executing
     * runtime should be readable prior to query timeout) and dangerous since the possibly
     * valid response will be dropped. Manual governance intervention is probably going to be
     * needed.
     */
    InvalidResponderVersion: PlainDescriptor<Anonymize<I3le5tr7ugg6l2>>;
    /**
     * Received query response has been read and removed.
     */
    ResponseTaken: PlainDescriptor<Anonymize<I30pg328m00nr3>>;
    /**
     * Some assets have been placed in an asset trap.
     */
    AssetsTrapped: PlainDescriptor<Anonymize<I381dkhrurdhrs>>;
    /**
     * An XCM version change notification message has been attempted to be sent.
     *
     * The cost of sending it (borne by the chain) is included.
     */
    VersionChangeNotified: PlainDescriptor<Anonymize<Ic8hi3qr11vngc>>;
    /**
     * The supported version of a location has been changed. This might be through an
     * automatic notification or a manual intervention.
     */
    SupportedVersionChanged: PlainDescriptor<Anonymize<Iabk8ljl5g8c86>>;
    /**
     * A given location which had a version change subscription was dropped owing to an error
     * sending the notification to it.
     */
    NotifyTargetSendFail: PlainDescriptor<Anonymize<Ibjdlecumfu7q7>>;
    /**
     * A given location which had a version change subscription was dropped owing to an error
     * migrating the location to our new XCM format.
     */
    NotifyTargetMigrationFail: PlainDescriptor<Anonymize<Ia9ems1kg7laoc>>;
    /**
     * Expected query response has been received but the expected querier location placed in
     * storage by this runtime previously cannot be decoded. The query remains registered.
     *
     * This is unexpected (since a location placed in storage in a previously executing
     * runtime should be readable prior to query timeout) and dangerous since the possibly
     * valid response will be dropped. Manual governance intervention is probably going to be
     * needed.
     */
    InvalidQuerierVersion: PlainDescriptor<Anonymize<I3le5tr7ugg6l2>>;
    /**
     * Expected query response has been received but the querier location of the response does
     * not match the expected. The query remains registered for a later, valid, response to
     * be received and acted upon.
     */
    InvalidQuerier: PlainDescriptor<Anonymize<I92fq0fa45vi3>>;
    /**
     * A remote has requested XCM version change notification from us and we have honored it.
     * A version information message is sent to them and its cost is included.
     */
    VersionNotifyStarted: PlainDescriptor<Anonymize<Id01dpp0dn2cj0>>;
    /**
     * We have requested that a remote chain send us XCM version change notifications.
     */
    VersionNotifyRequested: PlainDescriptor<Anonymize<Id01dpp0dn2cj0>>;
    /**
     * We have requested that a remote chain stops sending us XCM version change
     * notifications.
     */
    VersionNotifyUnrequested: PlainDescriptor<Anonymize<Id01dpp0dn2cj0>>;
    /**
     * Fees were paid from a location for an operation (often for using `SendXcm`).
     */
    FeesPaid: PlainDescriptor<Anonymize<I6nu8k62ck9o8o>>;
    /**
     * Some assets have been claimed from an asset trap
     */
    AssetsClaimed: PlainDescriptor<Anonymize<I381dkhrurdhrs>>;
    /**
     * A XCM version migration finished.
     */
    VersionMigrationFinished: PlainDescriptor<Anonymize<I6s1nbislhk619>>;
  };
  MessageQueue: {
    /**
     * Message discarded due to an error in the `MessageProcessor` (usually a format error).
     */
    ProcessingFailed: PlainDescriptor<Anonymize<I218fa3heih67o>>;
    /**
     * Message is processed.
     */
    Processed: PlainDescriptor<Anonymize<I1tf93k54ltg1v>>;
    /**
     * Message placed in overweight queue.
     */
    OverweightEnqueued: PlainDescriptor<Anonymize<I6ove5at7hfiur>>;
    /**
     * This page was reaped.
     */
    PageReaped: PlainDescriptor<Anonymize<I9c0urppp07b8b>>;
  };
  AssetRate: {
    /**
        
         */
    AssetRateCreated: PlainDescriptor<Anonymize<I6nmp4rhqla35>>;
    /**
        
         */
    AssetRateRemoved: PlainDescriptor<Anonymize<I8ndstn7sf4kek>>;
    /**
        
         */
    AssetRateUpdated: PlainDescriptor<Anonymize<I1a3ecmnlnvr59>>;
  };
};
type IError = {
  System: {
    /**
     * The name of specification does not match between the current runtime
     * and the new runtime.
     */
    InvalidSpecName: PlainDescriptor<undefined>;
    /**
     * The specification version is not allowed to decrease between the current runtime
     * and the new runtime.
     */
    SpecVersionNeedsToIncrease: PlainDescriptor<undefined>;
    /**
     * Failed to extract the runtime version from the new runtime.
     *
     * Either calling `Core_version` or decoding `RuntimeVersion` failed.
     */
    FailedToExtractRuntimeVersion: PlainDescriptor<undefined>;
    /**
     * Suicide called when the account has non-default composite data.
     */
    NonDefaultComposite: PlainDescriptor<undefined>;
    /**
     * There is a non-zero reference count preventing the account from being purged.
     */
    NonZeroRefCount: PlainDescriptor<undefined>;
    /**
     * The origin filter prevent the call to be dispatched.
     */
    CallFiltered: PlainDescriptor<undefined>;
    /**
     * A multi-block migration is ongoing and prevents the current code from being replaced.
     */
    MultiBlockMigrationsOngoing: PlainDescriptor<undefined>;
    /**
     * No upgrade authorized.
     */
    NothingAuthorized: PlainDescriptor<undefined>;
    /**
     * The submitted code is not authorized.
     */
    Unauthorized: PlainDescriptor<undefined>;
  };
  Babe: {
    /**
     * An equivocation proof provided as part of an equivocation report is invalid.
     */
    InvalidEquivocationProof: PlainDescriptor<undefined>;
    /**
     * A key ownership proof provided as part of an equivocation report is invalid.
     */
    InvalidKeyOwnershipProof: PlainDescriptor<undefined>;
    /**
     * A given equivocation report is valid but already previously reported.
     */
    DuplicateOffenceReport: PlainDescriptor<undefined>;
    /**
     * Submitted configuration is invalid.
     */
    InvalidConfiguration: PlainDescriptor<undefined>;
  };
  Indices: {
    /**
     * The index was not already assigned.
     */
    NotAssigned: PlainDescriptor<undefined>;
    /**
     * The index is assigned to another account.
     */
    NotOwner: PlainDescriptor<undefined>;
    /**
     * The index was not available.
     */
    InUse: PlainDescriptor<undefined>;
    /**
     * The source and destination accounts are identical.
     */
    NotTransfer: PlainDescriptor<undefined>;
    /**
     * The index is permanent and may not be freed/changed.
     */
    Permanent: PlainDescriptor<undefined>;
  };
  Balances: {
    /**
     * Vesting balance too high to send value.
     */
    VestingBalance: PlainDescriptor<undefined>;
    /**
     * Account liquidity restrictions prevent withdrawal.
     */
    LiquidityRestrictions: PlainDescriptor<undefined>;
    /**
     * Balance too low to send value.
     */
    InsufficientBalance: PlainDescriptor<undefined>;
    /**
     * Value too low to create account due to existential deposit.
     */
    ExistentialDeposit: PlainDescriptor<undefined>;
    /**
     * Transfer/payment would kill account.
     */
    Expendability: PlainDescriptor<undefined>;
    /**
     * A vesting schedule already exists for this account.
     */
    ExistingVestingSchedule: PlainDescriptor<undefined>;
    /**
     * Beneficiary account must pre-exist.
     */
    DeadAccount: PlainDescriptor<undefined>;
    /**
     * Number of named reserves exceed `MaxReserves`.
     */
    TooManyReserves: PlainDescriptor<undefined>;
    /**
     * Number of holds exceed `VariantCountOf<T::RuntimeHoldReason>`.
     */
    TooManyHolds: PlainDescriptor<undefined>;
    /**
     * Number of freezes exceed `MaxFreezes`.
     */
    TooManyFreezes: PlainDescriptor<undefined>;
    /**
     * The issuance cannot be modified since it is already deactivated.
     */
    IssuanceDeactivated: PlainDescriptor<undefined>;
    /**
     * The delta cannot be zero.
     */
    DeltaZero: PlainDescriptor<undefined>;
  };
  Staking: {
    /**
     * Not a controller account.
     */
    NotController: PlainDescriptor<undefined>;
    /**
     * Not a stash account.
     */
    NotStash: PlainDescriptor<undefined>;
    /**
     * Stash is already bonded.
     */
    AlreadyBonded: PlainDescriptor<undefined>;
    /**
     * Controller is already paired.
     */
    AlreadyPaired: PlainDescriptor<undefined>;
    /**
     * Targets cannot be empty.
     */
    EmptyTargets: PlainDescriptor<undefined>;
    /**
     * Duplicate index.
     */
    DuplicateIndex: PlainDescriptor<undefined>;
    /**
     * Slash record index out of bounds.
     */
    InvalidSlashIndex: PlainDescriptor<undefined>;
    /**
     * Cannot have a validator or nominator role, with value less than the minimum defined by
     * governance (see `MinValidatorBond` and `MinNominatorBond`). If unbonding is the
     * intention, `chill` first to remove one's role as validator/nominator.
     */
    InsufficientBond: PlainDescriptor<undefined>;
    /**
     * Can not schedule more unlock chunks.
     */
    NoMoreChunks: PlainDescriptor<undefined>;
    /**
     * Can not rebond without unlocking chunks.
     */
    NoUnlockChunk: PlainDescriptor<undefined>;
    /**
     * Attempting to target a stash that still has funds.
     */
    FundedTarget: PlainDescriptor<undefined>;
    /**
     * Invalid era to reward.
     */
    InvalidEraToReward: PlainDescriptor<undefined>;
    /**
     * Invalid number of nominations.
     */
    InvalidNumberOfNominations: PlainDescriptor<undefined>;
    /**
     * Items are not sorted and unique.
     */
    NotSortedAndUnique: PlainDescriptor<undefined>;
    /**
     * Rewards for this era have already been claimed for this validator.
     */
    AlreadyClaimed: PlainDescriptor<undefined>;
    /**
     * No nominators exist on this page.
     */
    InvalidPage: PlainDescriptor<undefined>;
    /**
     * Incorrect previous history depth input provided.
     */
    IncorrectHistoryDepth: PlainDescriptor<undefined>;
    /**
     * Incorrect number of slashing spans provided.
     */
    IncorrectSlashingSpans: PlainDescriptor<undefined>;
    /**
     * Internal state has become somehow corrupted and the operation cannot continue.
     */
    BadState: PlainDescriptor<undefined>;
    /**
     * Too many nomination targets supplied.
     */
    TooManyTargets: PlainDescriptor<undefined>;
    /**
     * A nomination target was supplied that was blocked or otherwise not a validator.
     */
    BadTarget: PlainDescriptor<undefined>;
    /**
     * The user has enough bond and thus cannot be chilled forcefully by an external person.
     */
    CannotChillOther: PlainDescriptor<undefined>;
    /**
     * There are too many nominators in the system. Governance needs to adjust the staking
     * settings to keep things safe for the runtime.
     */
    TooManyNominators: PlainDescriptor<undefined>;
    /**
     * There are too many validator candidates in the system. Governance needs to adjust the
     * staking settings to keep things safe for the runtime.
     */
    TooManyValidators: PlainDescriptor<undefined>;
    /**
     * Commission is too low. Must be at least `MinCommission`.
     */
    CommissionTooLow: PlainDescriptor<undefined>;
    /**
     * Some bound is not met.
     */
    BoundNotMet: PlainDescriptor<undefined>;
    /**
     * Used when attempting to use deprecated controller account logic.
     */
    ControllerDeprecated: PlainDescriptor<undefined>;
    /**
     * Cannot reset a ledger.
     */
    CannotRestoreLedger: PlainDescriptor<undefined>;
    /**
     * Provided reward destination is not allowed.
     */
    RewardDestinationRestricted: PlainDescriptor<undefined>;
    /**
     * Not enough funds available to withdraw.
     */
    NotEnoughFunds: PlainDescriptor<undefined>;
    /**
     * Operation not allowed for virtual stakers.
     */
    VirtualStakerNotAllowed: PlainDescriptor<undefined>;
    /**
     * Account is restricted from participation in staking. This may happen if the account is
     * staking in another way already, such as via pool.
     */
    Restricted: PlainDescriptor<undefined>;
  };
  Session: {
    /**
     * Invalid ownership proof.
     */
    InvalidProof: PlainDescriptor<undefined>;
    /**
     * No associated validator ID for account.
     */
    NoAssociatedValidatorId: PlainDescriptor<undefined>;
    /**
     * Registered duplicate key.
     */
    DuplicatedKey: PlainDescriptor<undefined>;
    /**
     * No keys are associated with this account.
     */
    NoKeys: PlainDescriptor<undefined>;
    /**
     * Key setting account is not live, so it's impossible to associate keys.
     */
    NoAccount: PlainDescriptor<undefined>;
  };
  Grandpa: {
    /**
     * Attempt to signal GRANDPA pause when the authority set isn't live
     * (either paused or already pending pause).
     */
    PauseFailed: PlainDescriptor<undefined>;
    /**
     * Attempt to signal GRANDPA resume when the authority set isn't paused
     * (either live or already pending resume).
     */
    ResumeFailed: PlainDescriptor<undefined>;
    /**
     * Attempt to signal GRANDPA change with one already pending.
     */
    ChangePending: PlainDescriptor<undefined>;
    /**
     * Cannot signal forced change so soon after last.
     */
    TooSoon: PlainDescriptor<undefined>;
    /**
     * A key ownership proof provided as part of an equivocation report is invalid.
     */
    InvalidKeyOwnershipProof: PlainDescriptor<undefined>;
    /**
     * An equivocation proof provided as part of an equivocation report is invalid.
     */
    InvalidEquivocationProof: PlainDescriptor<undefined>;
    /**
     * A given equivocation report is valid but already previously reported.
     */
    DuplicateOffenceReport: PlainDescriptor<undefined>;
  };
  Treasury: {
    /**
     * No proposal, bounty or spend at that index.
     */
    InvalidIndex: PlainDescriptor<undefined>;
    /**
     * Too many approvals in the queue.
     */
    TooManyApprovals: PlainDescriptor<undefined>;
    /**
     * The spend origin is valid but the amount it is allowed to spend is lower than the
     * amount to be spent.
     */
    InsufficientPermission: PlainDescriptor<undefined>;
    /**
     * Proposal has not been approved.
     */
    ProposalNotApproved: PlainDescriptor<undefined>;
    /**
     * The balance of the asset kind is not convertible to the balance of the native asset.
     */
    FailedToConvertBalance: PlainDescriptor<undefined>;
    /**
     * The spend has expired and cannot be claimed.
     */
    SpendExpired: PlainDescriptor<undefined>;
    /**
     * The spend is not yet eligible for payout.
     */
    EarlyPayout: PlainDescriptor<undefined>;
    /**
     * The payment has already been attempted.
     */
    AlreadyAttempted: PlainDescriptor<undefined>;
    /**
     * There was some issue with the mechanism of payment.
     */
    PayoutError: PlainDescriptor<undefined>;
    /**
     * The payout was not yet attempted/claimed.
     */
    NotAttempted: PlainDescriptor<undefined>;
    /**
     * The payment has neither failed nor succeeded yet.
     */
    Inconclusive: PlainDescriptor<undefined>;
  };
  ConvictionVoting: {
    /**
     * Poll is not ongoing.
     */
    NotOngoing: PlainDescriptor<undefined>;
    /**
     * The given account did not vote on the poll.
     */
    NotVoter: PlainDescriptor<undefined>;
    /**
     * The actor has no permission to conduct the action.
     */
    NoPermission: PlainDescriptor<undefined>;
    /**
     * The actor has no permission to conduct the action right now but will do in the future.
     */
    NoPermissionYet: PlainDescriptor<undefined>;
    /**
     * The account is already delegating.
     */
    AlreadyDelegating: PlainDescriptor<undefined>;
    /**
     * The account currently has votes attached to it and the operation cannot succeed until
     * these are removed through `remove_vote`.
     */
    AlreadyVoting: PlainDescriptor<undefined>;
    /**
     * Too high a balance was provided that the account cannot afford.
     */
    InsufficientFunds: PlainDescriptor<undefined>;
    /**
     * The account is not currently delegating.
     */
    NotDelegating: PlainDescriptor<undefined>;
    /**
     * Delegation to oneself makes no sense.
     */
    Nonsense: PlainDescriptor<undefined>;
    /**
     * Maximum number of votes reached.
     */
    MaxVotesReached: PlainDescriptor<undefined>;
    /**
     * The class must be supplied since it is not easily determinable from the state.
     */
    ClassNeeded: PlainDescriptor<undefined>;
    /**
     * The class ID supplied is invalid.
     */
    BadClass: PlainDescriptor<undefined>;
  };
  Referenda: {
    /**
     * Referendum is not ongoing.
     */
    NotOngoing: PlainDescriptor<undefined>;
    /**
     * Referendum's decision deposit is already paid.
     */
    HasDeposit: PlainDescriptor<undefined>;
    /**
     * The track identifier given was invalid.
     */
    BadTrack: PlainDescriptor<undefined>;
    /**
     * There are already a full complement of referenda in progress for this track.
     */
    Full: PlainDescriptor<undefined>;
    /**
     * The queue of the track is empty.
     */
    QueueEmpty: PlainDescriptor<undefined>;
    /**
     * The referendum index provided is invalid in this context.
     */
    BadReferendum: PlainDescriptor<undefined>;
    /**
     * There was nothing to do in the advancement.
     */
    NothingToDo: PlainDescriptor<undefined>;
    /**
     * No track exists for the proposal origin.
     */
    NoTrack: PlainDescriptor<undefined>;
    /**
     * Any deposit cannot be refunded until after the decision is over.
     */
    Unfinished: PlainDescriptor<undefined>;
    /**
     * The deposit refunder is not the depositor.
     */
    NoPermission: PlainDescriptor<undefined>;
    /**
     * The deposit cannot be refunded since none was made.
     */
    NoDeposit: PlainDescriptor<undefined>;
    /**
     * The referendum status is invalid for this operation.
     */
    BadStatus: PlainDescriptor<undefined>;
    /**
     * The preimage does not exist.
     */
    PreimageNotExist: PlainDescriptor<undefined>;
    /**
     * The preimage is stored with a different length than the one provided.
     */
    PreimageStoredWithDifferentLength: PlainDescriptor<undefined>;
  };
  FellowshipCollective: {
    /**
     * Account is already a member.
     */
    AlreadyMember: PlainDescriptor<undefined>;
    /**
     * Account is not a member.
     */
    NotMember: PlainDescriptor<undefined>;
    /**
     * The given poll index is unknown or has closed.
     */
    NotPolling: PlainDescriptor<undefined>;
    /**
     * The given poll is still ongoing.
     */
    Ongoing: PlainDescriptor<undefined>;
    /**
     * There are no further records to be removed.
     */
    NoneRemaining: PlainDescriptor<undefined>;
    /**
     * Unexpected error in state.
     */
    Corruption: PlainDescriptor<undefined>;
    /**
     * The member's rank is too low to vote.
     */
    RankTooLow: PlainDescriptor<undefined>;
    /**
     * The information provided is incorrect.
     */
    InvalidWitness: PlainDescriptor<undefined>;
    /**
     * The origin is not sufficiently privileged to do the operation.
     */
    NoPermission: PlainDescriptor<undefined>;
    /**
     * The new member to exchange is the same as the old member
     */
    SameMember: PlainDescriptor<undefined>;
    /**
     * The max member count for the rank has been reached.
     */
    TooManyMembers: PlainDescriptor<undefined>;
  };
  FellowshipReferenda: {
    /**
     * Referendum is not ongoing.
     */
    NotOngoing: PlainDescriptor<undefined>;
    /**
     * Referendum's decision deposit is already paid.
     */
    HasDeposit: PlainDescriptor<undefined>;
    /**
     * The track identifier given was invalid.
     */
    BadTrack: PlainDescriptor<undefined>;
    /**
     * There are already a full complement of referenda in progress for this track.
     */
    Full: PlainDescriptor<undefined>;
    /**
     * The queue of the track is empty.
     */
    QueueEmpty: PlainDescriptor<undefined>;
    /**
     * The referendum index provided is invalid in this context.
     */
    BadReferendum: PlainDescriptor<undefined>;
    /**
     * There was nothing to do in the advancement.
     */
    NothingToDo: PlainDescriptor<undefined>;
    /**
     * No track exists for the proposal origin.
     */
    NoTrack: PlainDescriptor<undefined>;
    /**
     * Any deposit cannot be refunded until after the decision is over.
     */
    Unfinished: PlainDescriptor<undefined>;
    /**
     * The deposit refunder is not the depositor.
     */
    NoPermission: PlainDescriptor<undefined>;
    /**
     * The deposit cannot be refunded since none was made.
     */
    NoDeposit: PlainDescriptor<undefined>;
    /**
     * The referendum status is invalid for this operation.
     */
    BadStatus: PlainDescriptor<undefined>;
    /**
     * The preimage does not exist.
     */
    PreimageNotExist: PlainDescriptor<undefined>;
    /**
     * The preimage is stored with a different length than the one provided.
     */
    PreimageStoredWithDifferentLength: PlainDescriptor<undefined>;
  };
  Whitelist: {
    /**
     * The preimage of the call hash could not be loaded.
     */
    UnavailablePreImage: PlainDescriptor<undefined>;
    /**
     * The call could not be decoded.
     */
    UndecodableCall: PlainDescriptor<undefined>;
    /**
     * The weight of the decoded call was higher than the witness.
     */
    InvalidCallWeightWitness: PlainDescriptor<undefined>;
    /**
     * The call was not whitelisted.
     */
    CallIsNotWhitelisted: PlainDescriptor<undefined>;
    /**
     * The call was already whitelisted; No-Op.
     */
    CallAlreadyWhitelisted: PlainDescriptor<undefined>;
  };
  Claims: {
    /**
     * Invalid Ethereum signature.
     */
    InvalidEthereumSignature: PlainDescriptor<undefined>;
    /**
     * Ethereum address has no claim.
     */
    SignerHasNoClaim: PlainDescriptor<undefined>;
    /**
     * Account ID sending transaction has no claim.
     */
    SenderHasNoClaim: PlainDescriptor<undefined>;
    /**
     * There's not enough in the pot to pay out some unvested amount. Generally implies a
     * logic error.
     */
    PotUnderflow: PlainDescriptor<undefined>;
    /**
     * A needed statement was not included.
     */
    InvalidStatement: PlainDescriptor<undefined>;
    /**
     * The account already has a vested balance.
     */
    VestedBalanceExists: PlainDescriptor<undefined>;
  };
  Utility: {
    /**
     * Too many calls batched.
     */
    TooManyCalls: PlainDescriptor<undefined>;
  };
  Society: {
    /**
     * User is not a member.
     */
    NotMember: PlainDescriptor<undefined>;
    /**
     * User is already a member.
     */
    AlreadyMember: PlainDescriptor<undefined>;
    /**
     * User is suspended.
     */
    Suspended: PlainDescriptor<undefined>;
    /**
     * User is not suspended.
     */
    NotSuspended: PlainDescriptor<undefined>;
    /**
     * Nothing to payout.
     */
    NoPayout: PlainDescriptor<undefined>;
    /**
     * Society already founded.
     */
    AlreadyFounded: PlainDescriptor<undefined>;
    /**
     * Not enough in pot to accept candidate.
     */
    InsufficientPot: PlainDescriptor<undefined>;
    /**
     * Member is already vouching or banned from vouching again.
     */
    AlreadyVouching: PlainDescriptor<undefined>;
    /**
     * Member is not vouching.
     */
    NotVouchingOnBidder: PlainDescriptor<undefined>;
    /**
     * Cannot remove the head of the chain.
     */
    Head: PlainDescriptor<undefined>;
    /**
     * Cannot remove the founder.
     */
    Founder: PlainDescriptor<undefined>;
    /**
     * User has already made a bid.
     */
    AlreadyBid: PlainDescriptor<undefined>;
    /**
     * User is already a candidate.
     */
    AlreadyCandidate: PlainDescriptor<undefined>;
    /**
     * User is not a candidate.
     */
    NotCandidate: PlainDescriptor<undefined>;
    /**
     * Too many members in the society.
     */
    MaxMembers: PlainDescriptor<undefined>;
    /**
     * The caller is not the founder.
     */
    NotFounder: PlainDescriptor<undefined>;
    /**
     * The caller is not the head.
     */
    NotHead: PlainDescriptor<undefined>;
    /**
     * The membership cannot be claimed as the candidate was not clearly approved.
     */
    NotApproved: PlainDescriptor<undefined>;
    /**
     * The candidate cannot be kicked as the candidate was not clearly rejected.
     */
    NotRejected: PlainDescriptor<undefined>;
    /**
     * The candidacy cannot be dropped as the candidate was clearly approved.
     */
    Approved: PlainDescriptor<undefined>;
    /**
     * The candidacy cannot be bestowed as the candidate was clearly rejected.
     */
    Rejected: PlainDescriptor<undefined>;
    /**
     * The candidacy cannot be concluded as the voting is still in progress.
     */
    InProgress: PlainDescriptor<undefined>;
    /**
     * The candidacy cannot be pruned until a full additional intake period has passed.
     */
    TooEarly: PlainDescriptor<undefined>;
    /**
     * The skeptic already voted.
     */
    Voted: PlainDescriptor<undefined>;
    /**
     * The skeptic need not vote on candidates from expired rounds.
     */
    Expired: PlainDescriptor<undefined>;
    /**
     * User is not a bidder.
     */
    NotBidder: PlainDescriptor<undefined>;
    /**
     * There is no defender currently.
     */
    NoDefender: PlainDescriptor<undefined>;
    /**
     * Group doesn't exist.
     */
    NotGroup: PlainDescriptor<undefined>;
    /**
     * The member is already elevated to this rank.
     */
    AlreadyElevated: PlainDescriptor<undefined>;
    /**
     * The skeptic has already been punished for this offence.
     */
    AlreadyPunished: PlainDescriptor<undefined>;
    /**
     * Funds are insufficient to pay off society debts.
     */
    InsufficientFunds: PlainDescriptor<undefined>;
    /**
     * The candidate/defender has no stale votes to remove.
     */
    NoVotes: PlainDescriptor<undefined>;
  };
  Recovery: {
    /**
     * User is not allowed to make a call on behalf of this account
     */
    NotAllowed: PlainDescriptor<undefined>;
    /**
     * Threshold must be greater than zero
     */
    ZeroThreshold: PlainDescriptor<undefined>;
    /**
     * Friends list must be greater than zero and threshold
     */
    NotEnoughFriends: PlainDescriptor<undefined>;
    /**
     * Friends list must be less than max friends
     */
    MaxFriends: PlainDescriptor<undefined>;
    /**
     * Friends list must be sorted and free of duplicates
     */
    NotSorted: PlainDescriptor<undefined>;
    /**
     * This account is not set up for recovery
     */
    NotRecoverable: PlainDescriptor<undefined>;
    /**
     * This account is already set up for recovery
     */
    AlreadyRecoverable: PlainDescriptor<undefined>;
    /**
     * A recovery process has already started for this account
     */
    AlreadyStarted: PlainDescriptor<undefined>;
    /**
     * A recovery process has not started for this rescuer
     */
    NotStarted: PlainDescriptor<undefined>;
    /**
     * This account is not a friend who can vouch
     */
    NotFriend: PlainDescriptor<undefined>;
    /**
     * The friend must wait until the delay period to vouch for this recovery
     */
    DelayPeriod: PlainDescriptor<undefined>;
    /**
     * This user has already vouched for this recovery
     */
    AlreadyVouched: PlainDescriptor<undefined>;
    /**
     * The threshold for recovering this account has not been met
     */
    Threshold: PlainDescriptor<undefined>;
    /**
     * There are still active recovery attempts that need to be closed
     */
    StillActive: PlainDescriptor<undefined>;
    /**
     * This account is already set up for recovery
     */
    AlreadyProxy: PlainDescriptor<undefined>;
    /**
     * Some internal state is broken.
     */
    BadState: PlainDescriptor<undefined>;
  };
  Vesting: {
    /**
     * The account given is not vesting.
     */
    NotVesting: PlainDescriptor<undefined>;
    /**
     * The account already has `MaxVestingSchedules` count of schedules and thus
     * cannot add another one. Consider merging existing schedules in order to add another.
     */
    AtMaxVestingSchedules: PlainDescriptor<undefined>;
    /**
     * Amount being transferred is too low to create a vesting schedule.
     */
    AmountLow: PlainDescriptor<undefined>;
    /**
     * An index was out of bounds of the vesting schedules.
     */
    ScheduleIndexOutOfBounds: PlainDescriptor<undefined>;
    /**
     * Failed to create a new schedule because some parameter was invalid.
     */
    InvalidScheduleParams: PlainDescriptor<undefined>;
  };
  Scheduler: {
    /**
     * Failed to schedule a call
     */
    FailedToSchedule: PlainDescriptor<undefined>;
    /**
     * Cannot find the scheduled call.
     */
    NotFound: PlainDescriptor<undefined>;
    /**
     * Given target block number is in the past.
     */
    TargetBlockNumberInPast: PlainDescriptor<undefined>;
    /**
     * Reschedule failed because it does not change scheduled time.
     */
    RescheduleNoChange: PlainDescriptor<undefined>;
    /**
     * Attempt to use a non-named function on a named task.
     */
    Named: PlainDescriptor<undefined>;
  };
  Proxy: {
    /**
     * There are too many proxies registered or too many announcements pending.
     */
    TooMany: PlainDescriptor<undefined>;
    /**
     * Proxy registration not found.
     */
    NotFound: PlainDescriptor<undefined>;
    /**
     * Sender is not a proxy of the account to be proxied.
     */
    NotProxy: PlainDescriptor<undefined>;
    /**
     * A call which is incompatible with the proxy type's filter was attempted.
     */
    Unproxyable: PlainDescriptor<undefined>;
    /**
     * Account is already a proxy.
     */
    Duplicate: PlainDescriptor<undefined>;
    /**
     * Call may not be made by proxy because it may escalate its privileges.
     */
    NoPermission: PlainDescriptor<undefined>;
    /**
     * Announcement, if made at all, was made too recently.
     */
    Unannounced: PlainDescriptor<undefined>;
    /**
     * Cannot add self as proxy.
     */
    NoSelfProxy: PlainDescriptor<undefined>;
  };
  Multisig: {
    /**
     * Threshold must be 2 or greater.
     */
    MinimumThreshold: PlainDescriptor<undefined>;
    /**
     * Call is already approved by this signatory.
     */
    AlreadyApproved: PlainDescriptor<undefined>;
    /**
     * Call doesn't need any (more) approvals.
     */
    NoApprovalsNeeded: PlainDescriptor<undefined>;
    /**
     * There are too few signatories in the list.
     */
    TooFewSignatories: PlainDescriptor<undefined>;
    /**
     * There are too many signatories in the list.
     */
    TooManySignatories: PlainDescriptor<undefined>;
    /**
     * The signatories were provided out of order; they should be ordered.
     */
    SignatoriesOutOfOrder: PlainDescriptor<undefined>;
    /**
     * The sender was contained in the other signatories; it shouldn't be.
     */
    SenderInSignatories: PlainDescriptor<undefined>;
    /**
     * Multisig operation not found when attempting to cancel.
     */
    NotFound: PlainDescriptor<undefined>;
    /**
     * Only the account that originally created the multisig is able to cancel it.
     */
    NotOwner: PlainDescriptor<undefined>;
    /**
     * No timepoint was given, yet the multisig operation is already underway.
     */
    NoTimepoint: PlainDescriptor<undefined>;
    /**
     * A different timepoint was given to the multisig operation that is underway.
     */
    WrongTimepoint: PlainDescriptor<undefined>;
    /**
     * A timepoint was given, yet no multisig operation is underway.
     */
    UnexpectedTimepoint: PlainDescriptor<undefined>;
    /**
     * The maximum weight information provided was too low.
     */
    MaxWeightTooLow: PlainDescriptor<undefined>;
    /**
     * The data to be stored is already stored.
     */
    AlreadyStored: PlainDescriptor<undefined>;
  };
  Preimage: {
    /**
     * Preimage is too large to store on-chain.
     */
    TooBig: PlainDescriptor<undefined>;
    /**
     * Preimage has already been noted on-chain.
     */
    AlreadyNoted: PlainDescriptor<undefined>;
    /**
     * The user is not authorized to perform this action.
     */
    NotAuthorized: PlainDescriptor<undefined>;
    /**
     * The preimage cannot be removed since it has not yet been noted.
     */
    NotNoted: PlainDescriptor<undefined>;
    /**
     * A preimage may not be removed when there are outstanding requests.
     */
    Requested: PlainDescriptor<undefined>;
    /**
     * The preimage request cannot be removed since no outstanding requests exist.
     */
    NotRequested: PlainDescriptor<undefined>;
    /**
     * More than `MAX_HASH_UPGRADE_BULK_COUNT` hashes were requested to be upgraded at once.
     */
    TooMany: PlainDescriptor<undefined>;
    /**
     * Too few hashes were requested to be upgraded (i.e. zero).
     */
    TooFew: PlainDescriptor<undefined>;
  };
  Bounties: {
    /**
     * Proposer's balance is too low.
     */
    InsufficientProposersBalance: PlainDescriptor<undefined>;
    /**
     * No proposal or bounty at that index.
     */
    InvalidIndex: PlainDescriptor<undefined>;
    /**
     * The reason given is just too big.
     */
    ReasonTooBig: PlainDescriptor<undefined>;
    /**
     * The bounty status is unexpected.
     */
    UnexpectedStatus: PlainDescriptor<undefined>;
    /**
     * Require bounty curator.
     */
    RequireCurator: PlainDescriptor<undefined>;
    /**
     * Invalid bounty value.
     */
    InvalidValue: PlainDescriptor<undefined>;
    /**
     * Invalid bounty fee.
     */
    InvalidFee: PlainDescriptor<undefined>;
    /**
     * A bounty payout is pending.
     * To cancel the bounty, you must unassign and slash the curator.
     */
    PendingPayout: PlainDescriptor<undefined>;
    /**
     * The bounties cannot be claimed/closed because it's still in the countdown period.
     */
    Premature: PlainDescriptor<undefined>;
    /**
     * The bounty cannot be closed because it has active child bounties.
     */
    HasActiveChildBounty: PlainDescriptor<undefined>;
    /**
     * Too many approvals are already queued.
     */
    TooManyQueued: PlainDescriptor<undefined>;
  };
  ChildBounties: {
    /**
     * The parent bounty is not in active state.
     */
    ParentBountyNotActive: PlainDescriptor<undefined>;
    /**
     * The bounty balance is not enough to add new child-bounty.
     */
    InsufficientBountyBalance: PlainDescriptor<undefined>;
    /**
     * Number of child bounties exceeds limit `MaxActiveChildBountyCount`.
     */
    TooManyChildBounties: PlainDescriptor<undefined>;
  };
  ElectionProviderMultiPhase: {
    /**
     * Submission was too early.
     */
    PreDispatchEarlySubmission: PlainDescriptor<undefined>;
    /**
     * Wrong number of winners presented.
     */
    PreDispatchWrongWinnerCount: PlainDescriptor<undefined>;
    /**
     * Submission was too weak, score-wise.
     */
    PreDispatchWeakSubmission: PlainDescriptor<undefined>;
    /**
     * The queue was full, and the solution was not better than any of the existing ones.
     */
    SignedQueueFull: PlainDescriptor<undefined>;
    /**
     * The origin failed to pay the deposit.
     */
    SignedCannotPayDeposit: PlainDescriptor<undefined>;
    /**
     * Witness data to dispatchable is invalid.
     */
    SignedInvalidWitness: PlainDescriptor<undefined>;
    /**
     * The signed submission consumes too much weight
     */
    SignedTooMuchWeight: PlainDescriptor<undefined>;
    /**
     * OCW submitted solution for wrong round
     */
    OcwCallWrongEra: PlainDescriptor<undefined>;
    /**
     * Snapshot metadata should exist but didn't.
     */
    MissingSnapshotMetadata: PlainDescriptor<undefined>;
    /**
     * `Self::insert_submission` returned an invalid index.
     */
    InvalidSubmissionIndex: PlainDescriptor<undefined>;
    /**
     * The call is not allowed at this point.
     */
    CallNotAllowed: PlainDescriptor<undefined>;
    /**
     * The fallback failed
     */
    FallbackFailed: PlainDescriptor<undefined>;
    /**
     * Some bound not met
     */
    BoundNotMet: PlainDescriptor<undefined>;
    /**
     * Submitted solution has too many winners
     */
    TooManyWinners: PlainDescriptor<undefined>;
    /**
     * Submission was prepared for a different round.
     */
    PreDispatchDifferentRound: PlainDescriptor<undefined>;
  };
  Nis: {
    /**
     * The duration of the bid is less than one.
     */
    DurationTooSmall: PlainDescriptor<undefined>;
    /**
     * The duration is the bid is greater than the number of queues.
     */
    DurationTooBig: PlainDescriptor<undefined>;
    /**
     * The amount of the bid is less than the minimum allowed.
     */
    AmountTooSmall: PlainDescriptor<undefined>;
    /**
     * The queue for the bid's duration is full and the amount bid is too low to get in
     * through replacing an existing bid.
     */
    BidTooLow: PlainDescriptor<undefined>;
    /**
     * Receipt index is unknown.
     */
    UnknownReceipt: PlainDescriptor<undefined>;
    /**
     * Not the owner of the receipt.
     */
    NotOwner: PlainDescriptor<undefined>;
    /**
     * Bond not yet at expiry date.
     */
    NotExpired: PlainDescriptor<undefined>;
    /**
     * The given bid for retraction is not found.
     */
    UnknownBid: PlainDescriptor<undefined>;
    /**
     * The portion supplied is beyond the value of the receipt.
     */
    PortionTooBig: PlainDescriptor<undefined>;
    /**
     * Not enough funds are held to pay out.
     */
    Unfunded: PlainDescriptor<undefined>;
    /**
     * There are enough funds for what is required.
     */
    AlreadyFunded: PlainDescriptor<undefined>;
    /**
     * The thaw throttle has been reached for this period.
     */
    Throttled: PlainDescriptor<undefined>;
    /**
     * The operation would result in a receipt worth an insignificant value.
     */
    MakesDust: PlainDescriptor<undefined>;
    /**
     * The receipt is already communal.
     */
    AlreadyCommunal: PlainDescriptor<undefined>;
    /**
     * The receipt is already private.
     */
    AlreadyPrivate: PlainDescriptor<undefined>;
  };
  NisCounterpartBalances: {
    /**
     * Vesting balance too high to send value.
     */
    VestingBalance: PlainDescriptor<undefined>;
    /**
     * Account liquidity restrictions prevent withdrawal.
     */
    LiquidityRestrictions: PlainDescriptor<undefined>;
    /**
     * Balance too low to send value.
     */
    InsufficientBalance: PlainDescriptor<undefined>;
    /**
     * Value too low to create account due to existential deposit.
     */
    ExistentialDeposit: PlainDescriptor<undefined>;
    /**
     * Transfer/payment would kill account.
     */
    Expendability: PlainDescriptor<undefined>;
    /**
     * A vesting schedule already exists for this account.
     */
    ExistingVestingSchedule: PlainDescriptor<undefined>;
    /**
     * Beneficiary account must pre-exist.
     */
    DeadAccount: PlainDescriptor<undefined>;
    /**
     * Number of named reserves exceed `MaxReserves`.
     */
    TooManyReserves: PlainDescriptor<undefined>;
    /**
     * Number of holds exceed `VariantCountOf<T::RuntimeHoldReason>`.
     */
    TooManyHolds: PlainDescriptor<undefined>;
    /**
     * Number of freezes exceed `MaxFreezes`.
     */
    TooManyFreezes: PlainDescriptor<undefined>;
    /**
     * The issuance cannot be modified since it is already deactivated.
     */
    IssuanceDeactivated: PlainDescriptor<undefined>;
    /**
     * The delta cannot be zero.
     */
    DeltaZero: PlainDescriptor<undefined>;
  };
  VoterList: {
    /**
     * A error in the list interface implementation.
     */
    List: PlainDescriptor<BagsListListListError>;
  };
  NominationPools: {
    /**
     * A (bonded) pool id does not exist.
     */
    PoolNotFound: PlainDescriptor<undefined>;
    /**
     * An account is not a member.
     */
    PoolMemberNotFound: PlainDescriptor<undefined>;
    /**
     * A reward pool does not exist. In all cases this is a system logic error.
     */
    RewardPoolNotFound: PlainDescriptor<undefined>;
    /**
     * A sub pool does not exist.
     */
    SubPoolsNotFound: PlainDescriptor<undefined>;
    /**
     * An account is already delegating in another pool. An account may only belong to one
     * pool at a time.
     */
    AccountBelongsToOtherPool: PlainDescriptor<undefined>;
    /**
     * The member is fully unbonded (and thus cannot access the bonded and reward pool
     * anymore to, for example, collect rewards).
     */
    FullyUnbonding: PlainDescriptor<undefined>;
    /**
     * The member cannot unbond further chunks due to reaching the limit.
     */
    MaxUnbondingLimit: PlainDescriptor<undefined>;
    /**
     * None of the funds can be withdrawn yet because the bonding duration has not passed.
     */
    CannotWithdrawAny: PlainDescriptor<undefined>;
    /**
     * The amount does not meet the minimum bond to either join or create a pool.
     *
     * The depositor can never unbond to a value less than `Pallet::depositor_min_bond`. The
     * caller does not have nominating permissions for the pool. Members can never unbond to a
     * value below `MinJoinBond`.
     */
    MinimumBondNotMet: PlainDescriptor<undefined>;
    /**
     * The transaction could not be executed due to overflow risk for the pool.
     */
    OverflowRisk: PlainDescriptor<undefined>;
    /**
     * A pool must be in [`PoolState::Destroying`] in order for the depositor to unbond or for
     * other members to be permissionlessly unbonded.
     */
    NotDestroying: PlainDescriptor<undefined>;
    /**
     * The caller does not have nominating permissions for the pool.
     */
    NotNominator: PlainDescriptor<undefined>;
    /**
     * Either a) the caller cannot make a valid kick or b) the pool is not destroying.
     */
    NotKickerOrDestroying: PlainDescriptor<undefined>;
    /**
     * The pool is not open to join
     */
    NotOpen: PlainDescriptor<undefined>;
    /**
     * The system is maxed out on pools.
     */
    MaxPools: PlainDescriptor<undefined>;
    /**
     * Too many members in the pool or system.
     */
    MaxPoolMembers: PlainDescriptor<undefined>;
    /**
     * The pools state cannot be changed.
     */
    CanNotChangeState: PlainDescriptor<undefined>;
    /**
     * The caller does not have adequate permissions.
     */
    DoesNotHavePermission: PlainDescriptor<undefined>;
    /**
     * Metadata exceeds [`Config::MaxMetadataLen`]
     */
    MetadataExceedsMaxLen: PlainDescriptor<undefined>;
    /**
     * Some error occurred that should never happen. This should be reported to the
     * maintainers.
     */
    Defensive: PlainDescriptor<Anonymize<Ie2db4l6126rkt>>;
    /**
     * Partial unbonding now allowed permissionlessly.
     */
    PartialUnbondNotAllowedPermissionlessly: PlainDescriptor<undefined>;
    /**
     * The pool's max commission cannot be set higher than the existing value.
     */
    MaxCommissionRestricted: PlainDescriptor<undefined>;
    /**
     * The supplied commission exceeds the max allowed commission.
     */
    CommissionExceedsMaximum: PlainDescriptor<undefined>;
    /**
     * The supplied commission exceeds global maximum commission.
     */
    CommissionExceedsGlobalMaximum: PlainDescriptor<undefined>;
    /**
     * Not enough blocks have surpassed since the last commission update.
     */
    CommissionChangeThrottled: PlainDescriptor<undefined>;
    /**
     * The submitted changes to commission change rate are not allowed.
     */
    CommissionChangeRateNotAllowed: PlainDescriptor<undefined>;
    /**
     * There is no pending commission to claim.
     */
    NoPendingCommission: PlainDescriptor<undefined>;
    /**
     * No commission current has been set.
     */
    NoCommissionCurrentSet: PlainDescriptor<undefined>;
    /**
     * Pool id currently in use.
     */
    PoolIdInUse: PlainDescriptor<undefined>;
    /**
     * Pool id provided is not correct/usable.
     */
    InvalidPoolId: PlainDescriptor<undefined>;
    /**
     * Bonding extra is restricted to the exact pending reward amount.
     */
    BondExtraRestricted: PlainDescriptor<undefined>;
    /**
     * No imbalance in the ED deposit for the pool.
     */
    NothingToAdjust: PlainDescriptor<undefined>;
    /**
     * No slash pending that can be applied to the member.
     */
    NothingToSlash: PlainDescriptor<undefined>;
    /**
     * The slash amount is too low to be applied.
     */
    SlashTooLow: PlainDescriptor<undefined>;
    /**
     * The pool or member delegation has already migrated to delegate stake.
     */
    AlreadyMigrated: PlainDescriptor<undefined>;
    /**
     * The pool or member delegation has not migrated yet to delegate stake.
     */
    NotMigrated: PlainDescriptor<undefined>;
    /**
     * This call is not allowed in the current state of the pallet.
     */
    NotSupported: PlainDescriptor<undefined>;
    /**
     * Account is restricted from participation in pools. This may happen if the account is
     * staking in another way already.
     */
    Restricted: PlainDescriptor<undefined>;
  };
  FastUnstake: {
    /**
     * The provided Controller account was not found.
     *
     * This means that the given account is not bonded.
     */
    NotController: PlainDescriptor<undefined>;
    /**
     * The bonded account has already been queued.
     */
    AlreadyQueued: PlainDescriptor<undefined>;
    /**
     * The bonded account has active unlocking chunks.
     */
    NotFullyBonded: PlainDescriptor<undefined>;
    /**
     * The provided un-staker is not in the `Queue`.
     */
    NotQueued: PlainDescriptor<undefined>;
    /**
     * The provided un-staker is already in Head, and cannot deregister.
     */
    AlreadyHead: PlainDescriptor<undefined>;
    /**
     * The call is not allowed at this point because the pallet is not active.
     */
    CallNotAllowed: PlainDescriptor<undefined>;
  };
  DelegatedStaking: {
    /**
     * The account cannot perform this operation.
     */
    NotAllowed: PlainDescriptor<undefined>;
    /**
     * An existing staker cannot perform this action.
     */
    AlreadyStaking: PlainDescriptor<undefined>;
    /**
     * Reward Destination cannot be same as `Agent` account.
     */
    InvalidRewardDestination: PlainDescriptor<undefined>;
    /**
     * Delegation conditions are not met.
     *
     * Possible issues are
     * 1) Cannot delegate to self,
     * 2) Cannot delegate to multiple delegates.
     */
    InvalidDelegation: PlainDescriptor<undefined>;
    /**
     * The account does not have enough funds to perform the operation.
     */
    NotEnoughFunds: PlainDescriptor<undefined>;
    /**
     * Not an existing `Agent` account.
     */
    NotAgent: PlainDescriptor<undefined>;
    /**
     * Not a Delegator account.
     */
    NotDelegator: PlainDescriptor<undefined>;
    /**
     * Some corruption in internal state.
     */
    BadState: PlainDescriptor<undefined>;
    /**
     * Unapplied pending slash restricts operation on `Agent`.
     */
    UnappliedSlash: PlainDescriptor<undefined>;
    /**
     * `Agent` has no pending slash to be applied.
     */
    NothingToSlash: PlainDescriptor<undefined>;
    /**
     * Failed to withdraw amount from Core Staking.
     */
    WithdrawFailed: PlainDescriptor<undefined>;
    /**
     * Operation not supported by this pallet.
     */
    NotSupported: PlainDescriptor<undefined>;
  };
  Configuration: {
    /**
     * The new value for a configuration parameter is invalid.
     */
    InvalidNewValue: PlainDescriptor<undefined>;
  };
  ParaInclusion: {
    /**
     * Validator index out of bounds.
     */
    ValidatorIndexOutOfBounds: PlainDescriptor<undefined>;
    /**
     * Candidate submitted but para not scheduled.
     */
    UnscheduledCandidate: PlainDescriptor<undefined>;
    /**
     * Head data exceeds the configured maximum.
     */
    HeadDataTooLarge: PlainDescriptor<undefined>;
    /**
     * Code upgrade prematurely.
     */
    PrematureCodeUpgrade: PlainDescriptor<undefined>;
    /**
     * Output code is too large
     */
    NewCodeTooLarge: PlainDescriptor<undefined>;
    /**
     * The candidate's relay-parent was not allowed. Either it was
     * not recent enough or it didn't advance based on the last parachain block.
     */
    DisallowedRelayParent: PlainDescriptor<undefined>;
    /**
     * Failed to compute group index for the core: either it's out of bounds
     * or the relay parent doesn't belong to the current session.
     */
    InvalidAssignment: PlainDescriptor<undefined>;
    /**
     * Invalid group index in core assignment.
     */
    InvalidGroupIndex: PlainDescriptor<undefined>;
    /**
     * Insufficient (non-majority) backing.
     */
    InsufficientBacking: PlainDescriptor<undefined>;
    /**
     * Invalid (bad signature, unknown validator, etc.) backing.
     */
    InvalidBacking: PlainDescriptor<undefined>;
    /**
     * The validation data hash does not match expected.
     */
    ValidationDataHashMismatch: PlainDescriptor<undefined>;
    /**
     * The downward message queue is not processed correctly.
     */
    IncorrectDownwardMessageHandling: PlainDescriptor<undefined>;
    /**
     * At least one upward message sent does not pass the acceptance criteria.
     */
    InvalidUpwardMessages: PlainDescriptor<undefined>;
    /**
     * The candidate didn't follow the rules of HRMP watermark advancement.
     */
    HrmpWatermarkMishandling: PlainDescriptor<undefined>;
    /**
     * The HRMP messages sent by the candidate is not valid.
     */
    InvalidOutboundHrmp: PlainDescriptor<undefined>;
    /**
     * The validation code hash of the candidate is not valid.
     */
    InvalidValidationCodeHash: PlainDescriptor<undefined>;
    /**
     * The `para_head` hash in the candidate descriptor doesn't match the hash of the actual
     * para head in the commitments.
     */
    ParaHeadMismatch: PlainDescriptor<undefined>;
  };
  ParaInherent: {
    /**
     * Inclusion inherent called more than once per block.
     */
    TooManyInclusionInherents: PlainDescriptor<undefined>;
    /**
     * The hash of the submitted parent header doesn't correspond to the saved block hash of
     * the parent.
     */
    InvalidParentHeader: PlainDescriptor<undefined>;
    /**
     * The data given to the inherent will result in an overweight block.
     */
    InherentOverweight: PlainDescriptor<undefined>;
    /**
     * A candidate was filtered during inherent execution. This should have only been done
     * during creation.
     */
    CandidatesFilteredDuringExecution: PlainDescriptor<undefined>;
    /**
     * Too many candidates supplied.
     */
    UnscheduledCandidate: PlainDescriptor<undefined>;
  };
  Paras: {
    /**
     * Para is not registered in our system.
     */
    NotRegistered: PlainDescriptor<undefined>;
    /**
     * Para cannot be onboarded because it is already tracked by our system.
     */
    CannotOnboard: PlainDescriptor<undefined>;
    /**
     * Para cannot be offboarded at this time.
     */
    CannotOffboard: PlainDescriptor<undefined>;
    /**
     * Para cannot be upgraded to a lease holding parachain.
     */
    CannotUpgrade: PlainDescriptor<undefined>;
    /**
     * Para cannot be downgraded to an on-demand parachain.
     */
    CannotDowngrade: PlainDescriptor<undefined>;
    /**
     * The statement for PVF pre-checking is stale.
     */
    PvfCheckStatementStale: PlainDescriptor<undefined>;
    /**
     * The statement for PVF pre-checking is for a future session.
     */
    PvfCheckStatementFuture: PlainDescriptor<undefined>;
    /**
     * Claimed validator index is out of bounds.
     */
    PvfCheckValidatorIndexOutOfBounds: PlainDescriptor<undefined>;
    /**
     * The signature for the PVF pre-checking is invalid.
     */
    PvfCheckInvalidSignature: PlainDescriptor<undefined>;
    /**
     * The given validator already has cast a vote.
     */
    PvfCheckDoubleVote: PlainDescriptor<undefined>;
    /**
     * The given PVF does not exist at the moment of process a vote.
     */
    PvfCheckSubjectInvalid: PlainDescriptor<undefined>;
    /**
     * Parachain cannot currently schedule a code upgrade.
     */
    CannotUpgradeCode: PlainDescriptor<undefined>;
    /**
     * Invalid validation code size.
     */
    InvalidCode: PlainDescriptor<undefined>;
  };
  Hrmp: {
    /**
     * The sender tried to open a channel to themselves.
     */
    OpenHrmpChannelToSelf: PlainDescriptor<undefined>;
    /**
     * The recipient is not a valid para.
     */
    OpenHrmpChannelInvalidRecipient: PlainDescriptor<undefined>;
    /**
     * The requested capacity is zero.
     */
    OpenHrmpChannelZeroCapacity: PlainDescriptor<undefined>;
    /**
     * The requested capacity exceeds the global limit.
     */
    OpenHrmpChannelCapacityExceedsLimit: PlainDescriptor<undefined>;
    /**
     * The requested maximum message size is 0.
     */
    OpenHrmpChannelZeroMessageSize: PlainDescriptor<undefined>;
    /**
     * The open request requested the message size that exceeds the global limit.
     */
    OpenHrmpChannelMessageSizeExceedsLimit: PlainDescriptor<undefined>;
    /**
     * The channel already exists
     */
    OpenHrmpChannelAlreadyExists: PlainDescriptor<undefined>;
    /**
     * There is already a request to open the same channel.
     */
    OpenHrmpChannelAlreadyRequested: PlainDescriptor<undefined>;
    /**
     * The sender already has the maximum number of allowed outbound channels.
     */
    OpenHrmpChannelLimitExceeded: PlainDescriptor<undefined>;
    /**
     * The channel from the sender to the origin doesn't exist.
     */
    AcceptHrmpChannelDoesntExist: PlainDescriptor<undefined>;
    /**
     * The channel is already confirmed.
     */
    AcceptHrmpChannelAlreadyConfirmed: PlainDescriptor<undefined>;
    /**
     * The recipient already has the maximum number of allowed inbound channels.
     */
    AcceptHrmpChannelLimitExceeded: PlainDescriptor<undefined>;
    /**
     * The origin tries to close a channel where it is neither the sender nor the recipient.
     */
    CloseHrmpChannelUnauthorized: PlainDescriptor<undefined>;
    /**
     * The channel to be closed doesn't exist.
     */
    CloseHrmpChannelDoesntExist: PlainDescriptor<undefined>;
    /**
     * The channel close request is already requested.
     */
    CloseHrmpChannelAlreadyUnderway: PlainDescriptor<undefined>;
    /**
     * Canceling is requested by neither the sender nor recipient of the open channel request.
     */
    CancelHrmpOpenChannelUnauthorized: PlainDescriptor<undefined>;
    /**
     * The open request doesn't exist.
     */
    OpenHrmpChannelDoesntExist: PlainDescriptor<undefined>;
    /**
     * Cannot cancel an HRMP open channel request because it is already confirmed.
     */
    OpenHrmpChannelAlreadyConfirmed: PlainDescriptor<undefined>;
    /**
     * The provided witness data is wrong.
     */
    WrongWitness: PlainDescriptor<undefined>;
    /**
     * The channel between these two chains cannot be authorized.
     */
    ChannelCreationNotAuthorized: PlainDescriptor<undefined>;
  };
  ParasDisputes: {
    /**
     * Duplicate dispute statement sets provided.
     */
    DuplicateDisputeStatementSets: PlainDescriptor<undefined>;
    /**
     * Ancient dispute statement provided.
     */
    AncientDisputeStatement: PlainDescriptor<undefined>;
    /**
     * Validator index on statement is out of bounds for session.
     */
    ValidatorIndexOutOfBounds: PlainDescriptor<undefined>;
    /**
     * Invalid signature on statement.
     */
    InvalidSignature: PlainDescriptor<undefined>;
    /**
     * Validator vote submitted more than once to dispute.
     */
    DuplicateStatement: PlainDescriptor<undefined>;
    /**
     * A dispute where there are only votes on one side.
     */
    SingleSidedDispute: PlainDescriptor<undefined>;
    /**
     * A dispute vote from a malicious backer.
     */
    MaliciousBacker: PlainDescriptor<undefined>;
    /**
     * No backing votes were provides along dispute statements.
     */
    MissingBackingVotes: PlainDescriptor<undefined>;
    /**
     * Unconfirmed dispute statement sets provided.
     */
    UnconfirmedDispute: PlainDescriptor<undefined>;
  };
  ParasSlashing: {
    /**
     * The key ownership proof is invalid.
     */
    InvalidKeyOwnershipProof: PlainDescriptor<undefined>;
    /**
     * The session index is too old or invalid.
     */
    InvalidSessionIndex: PlainDescriptor<undefined>;
    /**
     * The candidate hash is invalid.
     */
    InvalidCandidateHash: PlainDescriptor<undefined>;
    /**
     * There is no pending slash for the given validator index and time
     * slot.
     */
    InvalidValidatorIndex: PlainDescriptor<undefined>;
    /**
     * The validator index does not match the validator id.
     */
    ValidatorIndexIdMismatch: PlainDescriptor<undefined>;
    /**
     * The given slashing report is valid but already previously reported.
     */
    DuplicateSlashingReport: PlainDescriptor<undefined>;
  };
  OnDemandAssignmentProvider: {
    /**
     * The order queue is full, `place_order` will not continue.
     */
    QueueFull: PlainDescriptor<undefined>;
    /**
     * The current spot price is higher than the max amount specified in the `place_order`
     * call, making it invalid.
     */
    SpotPriceHigherThanMaxAmount: PlainDescriptor<undefined>;
  };
  CoretimeAssignmentProvider: {
    /**
        
         */
    AssignmentsEmpty: PlainDescriptor<undefined>;
    /**
     * Assignments together exceeded 57600.
     */
    OverScheduled: PlainDescriptor<undefined>;
    /**
     * Assignments together less than 57600
     */
    UnderScheduled: PlainDescriptor<undefined>;
    /**
     * assign_core is only allowed to append new assignments at the end of already existing
     * ones.
     */
    DisallowedInsert: PlainDescriptor<undefined>;
    /**
     * Tried to insert a schedule for the same core and block number as an existing schedule
     */
    DuplicateInsert: PlainDescriptor<undefined>;
    /**
     * Tried to add an unsorted set of assignments
     */
    AssignmentsNotSorted: PlainDescriptor<undefined>;
  };
  Registrar: {
    /**
     * The ID is not registered.
     */
    NotRegistered: PlainDescriptor<undefined>;
    /**
     * The ID is already registered.
     */
    AlreadyRegistered: PlainDescriptor<undefined>;
    /**
     * The caller is not the owner of this Id.
     */
    NotOwner: PlainDescriptor<undefined>;
    /**
     * Invalid para code size.
     */
    CodeTooLarge: PlainDescriptor<undefined>;
    /**
     * Invalid para head data size.
     */
    HeadDataTooLarge: PlainDescriptor<undefined>;
    /**
     * Para is not a Parachain.
     */
    NotParachain: PlainDescriptor<undefined>;
    /**
     * Para is not a Parathread (on-demand parachain).
     */
    NotParathread: PlainDescriptor<undefined>;
    /**
     * Cannot deregister para
     */
    CannotDeregister: PlainDescriptor<undefined>;
    /**
     * Cannot schedule downgrade of lease holding parachain to on-demand parachain
     */
    CannotDowngrade: PlainDescriptor<undefined>;
    /**
     * Cannot schedule upgrade of on-demand parachain to lease holding parachain
     */
    CannotUpgrade: PlainDescriptor<undefined>;
    /**
     * Para is locked from manipulation by the manager. Must use parachain or relay chain
     * governance.
     */
    ParaLocked: PlainDescriptor<undefined>;
    /**
     * The ID given for registration has not been reserved.
     */
    NotReserved: PlainDescriptor<undefined>;
    /**
     * The validation code is invalid.
     */
    InvalidCode: PlainDescriptor<undefined>;
    /**
     * Cannot perform a parachain slot / lifecycle swap. Check that the state of both paras
     * are correct for the swap to work.
     */
    CannotSwap: PlainDescriptor<undefined>;
  };
  Slots: {
    /**
     * The parachain ID is not onboarding.
     */
    ParaNotOnboarding: PlainDescriptor<undefined>;
    /**
     * There was an error with the lease.
     */
    LeaseError: PlainDescriptor<undefined>;
  };
  Auctions: {
    /**
     * This auction is already in progress.
     */
    AuctionInProgress: PlainDescriptor<undefined>;
    /**
     * The lease period is in the past.
     */
    LeasePeriodInPast: PlainDescriptor<undefined>;
    /**
     * Para is not registered
     */
    ParaNotRegistered: PlainDescriptor<undefined>;
    /**
     * Not a current auction.
     */
    NotCurrentAuction: PlainDescriptor<undefined>;
    /**
     * Not an auction.
     */
    NotAuction: PlainDescriptor<undefined>;
    /**
     * Auction has already ended.
     */
    AuctionEnded: PlainDescriptor<undefined>;
    /**
     * The para is already leased out for part of this range.
     */
    AlreadyLeasedOut: PlainDescriptor<undefined>;
  };
  Crowdloan: {
    /**
     * The current lease period is more than the first lease period.
     */
    FirstPeriodInPast: PlainDescriptor<undefined>;
    /**
     * The first lease period needs to at least be less than 3 `max_value`.
     */
    FirstPeriodTooFarInFuture: PlainDescriptor<undefined>;
    /**
     * Last lease period must be greater than first lease period.
     */
    LastPeriodBeforeFirstPeriod: PlainDescriptor<undefined>;
    /**
     * The last lease period cannot be more than 3 periods after the first period.
     */
    LastPeriodTooFarInFuture: PlainDescriptor<undefined>;
    /**
     * The campaign ends before the current block number. The end must be in the future.
     */
    CannotEndInPast: PlainDescriptor<undefined>;
    /**
     * The end date for this crowdloan is not sensible.
     */
    EndTooFarInFuture: PlainDescriptor<undefined>;
    /**
     * There was an overflow.
     */
    Overflow: PlainDescriptor<undefined>;
    /**
     * The contribution was below the minimum, `MinContribution`.
     */
    ContributionTooSmall: PlainDescriptor<undefined>;
    /**
     * Invalid fund index.
     */
    InvalidParaId: PlainDescriptor<undefined>;
    /**
     * Contributions exceed maximum amount.
     */
    CapExceeded: PlainDescriptor<undefined>;
    /**
     * The contribution period has already ended.
     */
    ContributionPeriodOver: PlainDescriptor<undefined>;
    /**
     * The origin of this call is invalid.
     */
    InvalidOrigin: PlainDescriptor<undefined>;
    /**
     * This crowdloan does not correspond to a parachain.
     */
    NotParachain: PlainDescriptor<undefined>;
    /**
     * This parachain lease is still active and retirement cannot yet begin.
     */
    LeaseActive: PlainDescriptor<undefined>;
    /**
     * This parachain's bid or lease is still active and withdraw cannot yet begin.
     */
    BidOrLeaseActive: PlainDescriptor<undefined>;
    /**
     * The crowdloan has not yet ended.
     */
    FundNotEnded: PlainDescriptor<undefined>;
    /**
     * There are no contributions stored in this crowdloan.
     */
    NoContributions: PlainDescriptor<undefined>;
    /**
     * The crowdloan is not ready to dissolve. Potentially still has a slot or in retirement
     * period.
     */
    NotReadyToDissolve: PlainDescriptor<undefined>;
    /**
     * Invalid signature.
     */
    InvalidSignature: PlainDescriptor<undefined>;
    /**
     * The provided memo is too large.
     */
    MemoTooLarge: PlainDescriptor<undefined>;
    /**
     * The fund is already in `NewRaise`
     */
    AlreadyInNewRaise: PlainDescriptor<undefined>;
    /**
     * No contributions allowed during the VRF delay
     */
    VrfDelayInProgress: PlainDescriptor<undefined>;
    /**
     * A lease period has not started yet, due to an offset in the starting block.
     */
    NoLeasePeriod: PlainDescriptor<undefined>;
  };
  Coretime: {
    /**
     * The paraid making the call is not the coretime brokerage system parachain.
     */
    NotBroker: PlainDescriptor<undefined>;
    /**
     * Requested revenue information `when` parameter was in the future from the current
     * block height.
     */
    RequestedFutureRevenue: PlainDescriptor<undefined>;
    /**
     * Failed to transfer assets to the coretime chain
     */
    AssetTransferFailed: PlainDescriptor<undefined>;
  };
  XcmPallet: {
    /**
     * The desired destination was unreachable, generally because there is a no way of routing
     * to it.
     */
    Unreachable: PlainDescriptor<undefined>;
    /**
     * There was some other issue (i.e. not to do with routing) in sending the message.
     * Perhaps a lack of space for buffering the message.
     */
    SendFailure: PlainDescriptor<undefined>;
    /**
     * The message execution fails the filter.
     */
    Filtered: PlainDescriptor<undefined>;
    /**
     * The message's weight could not be determined.
     */
    UnweighableMessage: PlainDescriptor<undefined>;
    /**
     * The destination `Location` provided cannot be inverted.
     */
    DestinationNotInvertible: PlainDescriptor<undefined>;
    /**
     * The assets to be sent are empty.
     */
    Empty: PlainDescriptor<undefined>;
    /**
     * Could not re-anchor the assets to declare the fees for the destination chain.
     */
    CannotReanchor: PlainDescriptor<undefined>;
    /**
     * Too many assets have been attempted for transfer.
     */
    TooManyAssets: PlainDescriptor<undefined>;
    /**
     * Origin is invalid for sending.
     */
    InvalidOrigin: PlainDescriptor<undefined>;
    /**
     * The version of the `Versioned` value used is not able to be interpreted.
     */
    BadVersion: PlainDescriptor<undefined>;
    /**
     * The given location could not be used (e.g. because it cannot be expressed in the
     * desired version of XCM).
     */
    BadLocation: PlainDescriptor<undefined>;
    /**
     * The referenced subscription could not be found.
     */
    NoSubscription: PlainDescriptor<undefined>;
    /**
     * The location is invalid since it already has a subscription from us.
     */
    AlreadySubscribed: PlainDescriptor<undefined>;
    /**
     * Could not check-out the assets for teleportation to the destination chain.
     */
    CannotCheckOutTeleport: PlainDescriptor<undefined>;
    /**
     * The owner does not own (all) of the asset that they wish to do the operation on.
     */
    LowBalance: PlainDescriptor<undefined>;
    /**
     * The asset owner has too many locks on the asset.
     */
    TooManyLocks: PlainDescriptor<undefined>;
    /**
     * The given account is not an identifiable sovereign account for any location.
     */
    AccountNotSovereign: PlainDescriptor<undefined>;
    /**
     * The operation required fees to be paid which the initiator could not meet.
     */
    FeesNotMet: PlainDescriptor<undefined>;
    /**
     * A remote lock with the corresponding data could not be found.
     */
    LockNotFound: PlainDescriptor<undefined>;
    /**
     * The unlock operation cannot succeed because there are still consumers of the lock.
     */
    InUse: PlainDescriptor<undefined>;
    /**
     * Invalid asset, reserve chain could not be determined for it.
     */
    InvalidAssetUnknownReserve: PlainDescriptor<undefined>;
    /**
     * Invalid asset, do not support remote asset reserves with different fees reserves.
     */
    InvalidAssetUnsupportedReserve: PlainDescriptor<undefined>;
    /**
     * Too many assets with different reserve locations have been attempted for transfer.
     */
    TooManyReserves: PlainDescriptor<undefined>;
    /**
     * Local XCM execution incomplete.
     */
    LocalExecutionIncomplete: PlainDescriptor<undefined>;
  };
  MessageQueue: {
    /**
     * Page is not reapable because it has items remaining to be processed and is not old
     * enough.
     */
    NotReapable: PlainDescriptor<undefined>;
    /**
     * Page to be reaped does not exist.
     */
    NoPage: PlainDescriptor<undefined>;
    /**
     * The referenced message could not be found.
     */
    NoMessage: PlainDescriptor<undefined>;
    /**
     * The message was already processed and cannot be processed again.
     */
    AlreadyProcessed: PlainDescriptor<undefined>;
    /**
     * The message is queued for future execution.
     */
    Queued: PlainDescriptor<undefined>;
    /**
     * There is temporarily not enough weight to continue servicing messages.
     */
    InsufficientWeight: PlainDescriptor<undefined>;
    /**
     * This message is temporarily unprocessable.
     *
     * Such errors are expected, but not guaranteed, to resolve themselves eventually through
     * retrying.
     */
    TemporarilyUnprocessable: PlainDescriptor<undefined>;
    /**
     * The queue is paused and no message can be executed from it.
     *
     * This can change at any time and may resolve in the future by re-trying.
     */
    QueuePaused: PlainDescriptor<undefined>;
    /**
     * Another call is in progress and needs to finish before this call can happen.
     */
    RecursiveDisallowed: PlainDescriptor<undefined>;
  };
  AssetRate: {
    /**
     * The given asset ID is unknown.
     */
    UnknownAssetKind: PlainDescriptor<undefined>;
    /**
     * The given asset ID already has an assigned conversion rate and cannot be re-created.
     */
    AlreadyExists: PlainDescriptor<undefined>;
    /**
     * Overflow ocurred when calculating the inverse rate.
     */
    Overflow: PlainDescriptor<undefined>;
  };
  Beefy: {
    /**
     * A key ownership proof provided as part of an equivocation report is invalid.
     */
    InvalidKeyOwnershipProof: PlainDescriptor<undefined>;
    /**
     * A double voting proof provided as part of an equivocation report is invalid.
     */
    InvalidDoubleVotingProof: PlainDescriptor<undefined>;
    /**
     * A fork voting proof provided as part of an equivocation report is invalid.
     */
    InvalidForkVotingProof: PlainDescriptor<undefined>;
    /**
     * A future block voting proof provided as part of an equivocation report is invalid.
     */
    InvalidFutureBlockVotingProof: PlainDescriptor<undefined>;
    /**
     * The session of the equivocation proof is invalid
     */
    InvalidEquivocationProofSession: PlainDescriptor<undefined>;
    /**
     * A given equivocation report is valid but already previously reported.
     */
    DuplicateOffenceReport: PlainDescriptor<undefined>;
    /**
     * Submitted configuration is invalid.
     */
    InvalidConfiguration: PlainDescriptor<undefined>;
  };
};
type IConstants = {
  System: {
    /**
     * Block & extrinsics weights: base values and limits.
     */
    BlockWeights: PlainDescriptor<Anonymize<In7a38730s6qs>>;
    /**
     * The maximum length of a block (in bytes).
     */
    BlockLength: PlainDescriptor<Anonymize<If15el53dd76v9>>;
    /**
     * Maximum number of block number to block hash mappings to keep (oldest pruned first).
     */
    BlockHashCount: PlainDescriptor<number>;
    /**
     * The weight of runtime database operations the runtime can invoke.
     */
    DbWeight: PlainDescriptor<Anonymize<I9s0ave7t0vnrk>>;
    /**
     * Get the chain's in-code version.
     */
    Version: PlainDescriptor<Anonymize<Ic6nglu2db2c36>>;
    /**
     * The designated SS58 prefix of this chain.
     *
     * This replaces the "ss58Format" property declared in the chain spec. Reason is
     * that the runtime should know about the prefix in order to make use of it as
     * an identifier of the chain.
     */
    SS58Prefix: PlainDescriptor<number>;
  };
  Babe: {
    /**
     * The amount of time, in slots, that each epoch should last.
     * NOTE: Currently it is not possible to change the epoch duration after
     * the chain has started. Attempting to do so will brick block production.
     */
    EpochDuration: PlainDescriptor<bigint>;
    /**
     * The expected average block time at which BABE should be creating
     * blocks. Since BABE is probabilistic it is not trivial to figure out
     * what the expected average block time should be based on the slot
     * duration and the security parameter `c` (where `1 - c` represents
     * the probability of a slot being empty).
     */
    ExpectedBlockTime: PlainDescriptor<bigint>;
    /**
     * Max number of authorities allowed
     */
    MaxAuthorities: PlainDescriptor<number>;
    /**
     * The maximum number of nominators for each validator.
     */
    MaxNominators: PlainDescriptor<number>;
  };
  Timestamp: {
    /**
     * The minimum period between blocks.
     *
     * Be aware that this is different to the *expected* period that the block production
     * apparatus provides. Your chosen consensus system will generally work with this to
     * determine a sensible block time. For example, in the Aura pallet it will be double this
     * period on default settings.
     */
    MinimumPeriod: PlainDescriptor<bigint>;
  };
  Indices: {
    /**
     * The deposit needed for reserving an index.
     */
    Deposit: PlainDescriptor<bigint>;
  };
  Balances: {
    /**
     * The minimum amount required to keep an account open. MUST BE GREATER THAN ZERO!
     *
     * If you *really* need it to be zero, you can enable the feature `insecure_zero_ed` for
     * this pallet. However, you do so at your own risk: this will open up a major DoS vector.
     * In case you have multiple sources of provider references, you may also get unexpected
     * behaviour if you set this to zero.
     *
     * Bottom line: Do yourself a favour and make it at least one!
     */
    ExistentialDeposit: PlainDescriptor<bigint>;
    /**
     * The maximum number of locks that should exist on an account.
     * Not strictly enforced, but used for weight estimation.
     *
     * Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    MaxLocks: PlainDescriptor<number>;
    /**
     * The maximum number of named reserves that can exist on an account.
     *
     * Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    MaxReserves: PlainDescriptor<number>;
    /**
     * The maximum number of individual freeze locks that can exist on an account at any time.
     */
    MaxFreezes: PlainDescriptor<number>;
  };
  TransactionPayment: {
    /**
     * A fee multiplier for `Operational` extrinsics to compute "virtual tip" to boost their
     * `priority`
     *
     * This value is multiplied by the `final_fee` to obtain a "virtual tip" that is later
     * added to a tip component in regular `priority` calculations.
     * It means that a `Normal` transaction can front-run a similarly-sized `Operational`
     * extrinsic (with no tip), by including a tip value greater than the virtual tip.
     *
     * ```rust,ignore
     * // For `Normal`
     * let priority = priority_calc(tip);
     *
     * // For `Operational`
     * let virtual_tip = (inclusion_fee + tip) * OperationalFeeMultiplier;
     * let priority = priority_calc(tip + virtual_tip);
     * ```
     *
     * Note that since we use `final_fee` the multiplier applies also to the regular `tip`
     * sent with the transaction. So, not only does the transaction get a priority bump based
     * on the `inclusion_fee`, but we also amplify the impact of tips applied to `Operational`
     * transactions.
     */
    OperationalFeeMultiplier: PlainDescriptor<number>;
  };
  Staking: {
    /**
     * Number of eras to keep in history.
     *
     * Following information is kept for eras in `[current_era -
     * HistoryDepth, current_era]`: `ErasStakers`, `ErasStakersClipped`,
     * `ErasValidatorPrefs`, `ErasValidatorReward`, `ErasRewardPoints`,
     * `ErasTotalStake`, `ErasStartSessionIndex`, `ClaimedRewards`, `ErasStakersPaged`,
     * `ErasStakersOverview`.
     *
     * Must be more than the number of eras delayed by session.
     * I.e. active era must always be in history. I.e. `active_era >
     * current_era - history_depth` must be guaranteed.
     *
     * If migrating an existing pallet from storage value to config value,
     * this should be set to same value or greater as in storage.
     *
     * Note: `HistoryDepth` is used as the upper bound for the `BoundedVec`
     * item `StakingLedger.legacy_claimed_rewards`. Setting this value lower than
     * the existing value can lead to inconsistencies in the
     * `StakingLedger` and will need to be handled properly in a migration.
     * The test `reducing_history_depth_abrupt` shows this effect.
     */
    HistoryDepth: PlainDescriptor<number>;
    /**
     * Number of sessions per era.
     */
    SessionsPerEra: PlainDescriptor<number>;
    /**
     * Number of eras that staked funds must remain bonded for.
     */
    BondingDuration: PlainDescriptor<number>;
    /**
     * Number of eras that slashes are deferred by, after computation.
     *
     * This should be less than the bonding duration. Set to 0 if slashes
     * should be applied immediately, without opportunity for intervention.
     */
    SlashDeferDuration: PlainDescriptor<number>;
    /**
     * The maximum size of each `T::ExposurePage`.
     *
     * An `ExposurePage` is weakly bounded to a maximum of `MaxExposurePageSize`
     * nominators.
     *
     * For older non-paged exposure, a reward payout was restricted to the top
     * `MaxExposurePageSize` nominators. This is to limit the i/o cost for the
     * nominator payout.
     *
     * Note: `MaxExposurePageSize` is used to bound `ClaimedRewards` and is unsafe to reduce
     * without handling it in a migration.
     */
    MaxExposurePageSize: PlainDescriptor<number>;
    /**
     * The maximum number of `unlocking` chunks a [`StakingLedger`] can
     * have. Effectively determines how many unique eras a staker may be
     * unbonding in.
     *
     * Note: `MaxUnlockingChunks` is used as the upper bound for the
     * `BoundedVec` item `StakingLedger.unlocking`. Setting this value
     * lower than the existing value can lead to inconsistencies in the
     * `StakingLedger` and will need to be handled properly in a runtime
     * migration. The test `reducing_max_unlocking_chunks_abrupt` shows
     * this effect.
     */
    MaxUnlockingChunks: PlainDescriptor<number>;
  };
  Grandpa: {
    /**
     * Max Authorities in use
     */
    MaxAuthorities: PlainDescriptor<number>;
    /**
     * The maximum number of nominators for each validator.
     */
    MaxNominators: PlainDescriptor<number>;
    /**
     * The maximum number of entries to keep in the set id to session index mapping.
     *
     * Since the `SetIdSession` map is only used for validating equivocations this
     * value should relate to the bonding duration of whatever staking system is
     * being used (if any). If equivocation handling is not enabled then this value
     * can be zero.
     */
    MaxSetIdSessionEntries: PlainDescriptor<bigint>;
  };
  Treasury: {
    /**
     * Period between successive spends.
     */
    SpendPeriod: PlainDescriptor<number>;
    /**
     * Percentage of spare funds (if any) that are burnt per spend period.
     */
    Burn: PlainDescriptor<number>;
    /**
     * The treasury's pallet id, used for deriving its sovereign account ID.
     */
    PalletId: PlainDescriptor<FixedSizeBinary<8>>;
    /**
     * The maximum number of approvals that can wait in the spending queue.
     *
     * NOTE: This parameter is also used within the Bounties Pallet extension if enabled.
     */
    MaxApprovals: PlainDescriptor<number>;
    /**
     * The period during which an approved treasury spend has to be claimed.
     */
    PayoutPeriod: PlainDescriptor<number>;
  };
  ConvictionVoting: {
    /**
     * The maximum number of concurrent votes an account may have.
     *
     * Also used to compute weight, an overly large value can lead to extrinsics with large
     * weight estimation: see `delegate` for instance.
     */
    MaxVotes: PlainDescriptor<number>;
    /**
     * The minimum period of vote locking.
     *
     * It should be no shorter than enactment period to ensure that in the case of an approval,
     * those successful voters are locked into the consequences that their votes entail.
     */
    VoteLockingPeriod: PlainDescriptor<number>;
  };
  Referenda: {
    /**
     * The minimum amount to be used as a deposit for a public referendum proposal.
     */
    SubmissionDeposit: PlainDescriptor<bigint>;
    /**
     * Maximum size of the referendum queue for a single track.
     */
    MaxQueued: PlainDescriptor<number>;
    /**
     * The number of blocks after submission that a referendum must begin being decided by.
     * Once this passes, then anyone may cancel the referendum.
     */
    UndecidingTimeout: PlainDescriptor<number>;
    /**
     * Quantization level for the referendum wakeup scheduler. A higher number will result in
     * fewer storage reads/writes needed for smaller voters, but also result in delays to the
     * automatic referendum status changes. Explicit servicing instructions are unaffected.
     */
    AlarmInterval: PlainDescriptor<number>;
    /**
     * Information concerning the different referendum tracks.
     */
    Tracks: PlainDescriptor<Anonymize<Ibafpkl9hhno69>>;
  };
  FellowshipReferenda: {
    /**
     * The minimum amount to be used as a deposit for a public referendum proposal.
     */
    SubmissionDeposit: PlainDescriptor<bigint>;
    /**
     * Maximum size of the referendum queue for a single track.
     */
    MaxQueued: PlainDescriptor<number>;
    /**
     * The number of blocks after submission that a referendum must begin being decided by.
     * Once this passes, then anyone may cancel the referendum.
     */
    UndecidingTimeout: PlainDescriptor<number>;
    /**
     * Quantization level for the referendum wakeup scheduler. A higher number will result in
     * fewer storage reads/writes needed for smaller voters, but also result in delays to the
     * automatic referendum status changes. Explicit servicing instructions are unaffected.
     */
    AlarmInterval: PlainDescriptor<number>;
    /**
     * Information concerning the different referendum tracks.
     */
    Tracks: PlainDescriptor<Anonymize<Ibafpkl9hhno69>>;
  };
  Claims: {
    /**
        
         */
    Prefix: PlainDescriptor<Binary>;
  };
  Utility: {
    /**
     * The limit on the number of batched calls.
     */
    batched_calls_limit: PlainDescriptor<number>;
  };
  Society: {
    /**
     * The societies's pallet id
     */
    PalletId: PlainDescriptor<FixedSizeBinary<8>>;
    /**
     * The maximum number of strikes before a member gets funds slashed.
     */
    GraceStrikes: PlainDescriptor<number>;
    /**
     * The amount of incentive paid within each period. Doesn't include VoterTip.
     */
    PeriodSpend: PlainDescriptor<bigint>;
    /**
     * The number of blocks on which new candidates should be voted on. Together with
     * `ClaimPeriod`, this sums to the number of blocks between candidate intake periods.
     */
    VotingPeriod: PlainDescriptor<number>;
    /**
     * The number of blocks on which new candidates can claim their membership and be the
     * named head.
     */
    ClaimPeriod: PlainDescriptor<number>;
    /**
     * The maximum duration of the payout lock.
     */
    MaxLockDuration: PlainDescriptor<number>;
    /**
     * The number of blocks between membership challenges.
     */
    ChallengePeriod: PlainDescriptor<number>;
    /**
     * The maximum number of payouts a member may have waiting unclaimed.
     */
    MaxPayouts: PlainDescriptor<number>;
    /**
     * The maximum number of bids at once.
     */
    MaxBids: PlainDescriptor<number>;
  };
  Recovery: {
    /**
     * The base amount of currency needed to reserve for creating a recovery configuration.
     *
     * This is held for an additional storage item whose value size is
     * `2 + sizeof(BlockNumber, Balance)` bytes.
     */
    ConfigDepositBase: PlainDescriptor<bigint>;
    /**
     * The amount of currency needed per additional user when creating a recovery
     * configuration.
     *
     * This is held for adding `sizeof(AccountId)` bytes more into a pre-existing storage
     * value.
     */
    FriendDepositFactor: PlainDescriptor<bigint>;
    /**
     * The maximum amount of friends allowed in a recovery configuration.
     *
     * NOTE: The threshold programmed in this Pallet uses u16, so it does
     * not really make sense to have a limit here greater than u16::MAX.
     * But also, that is a lot more than you should probably set this value
     * to anyway...
     */
    MaxFriends: PlainDescriptor<number>;
    /**
     * The base amount of currency needed to reserve for starting a recovery.
     *
     * This is primarily held for deterring malicious recovery attempts, and should
     * have a value large enough that a bad actor would choose not to place this
     * deposit. It also acts to fund additional storage item whose value size is
     * `sizeof(BlockNumber, Balance + T * AccountId)` bytes. Where T is a configurable
     * threshold.
     */
    RecoveryDeposit: PlainDescriptor<bigint>;
  };
  Vesting: {
    /**
     * The minimum amount transferred to call `vested_transfer`.
     */
    MinVestedTransfer: PlainDescriptor<bigint>;
    /**
        
         */
    MaxVestingSchedules: PlainDescriptor<number>;
  };
  Scheduler: {
    /**
     * The maximum weight that may be scheduled per block for any dispatchables.
     */
    MaximumWeight: PlainDescriptor<Anonymize<I4q39t5hn830vp>>;
    /**
     * The maximum number of scheduled calls in the queue for a single block.
     *
     * NOTE:
     * + Dependent pallets' benchmarks might require a higher limit for the setting. Set a
     * higher limit under `runtime-benchmarks` feature.
     */
    MaxScheduledPerBlock: PlainDescriptor<number>;
  };
  Proxy: {
    /**
     * The base amount of currency needed to reserve for creating a proxy.
     *
     * This is held for an additional storage item whose value size is
     * `sizeof(Balance)` bytes and whose key size is `sizeof(AccountId)` bytes.
     */
    ProxyDepositBase: PlainDescriptor<bigint>;
    /**
     * The amount of currency needed per proxy added.
     *
     * This is held for adding 32 bytes plus an instance of `ProxyType` more into a
     * pre-existing storage value. Thus, when configuring `ProxyDepositFactor` one should take
     * into account `32 + proxy_type.encode().len()` bytes of data.
     */
    ProxyDepositFactor: PlainDescriptor<bigint>;
    /**
     * The maximum amount of proxies allowed for a single account.
     */
    MaxProxies: PlainDescriptor<number>;
    /**
     * The maximum amount of time-delayed announcements that are allowed to be pending.
     */
    MaxPending: PlainDescriptor<number>;
    /**
     * The base amount of currency needed to reserve for creating an announcement.
     *
     * This is held when a new storage item holding a `Balance` is created (typically 16
     * bytes).
     */
    AnnouncementDepositBase: PlainDescriptor<bigint>;
    /**
     * The amount of currency needed per announcement made.
     *
     * This is held for adding an `AccountId`, `Hash` and `BlockNumber` (typically 68 bytes)
     * into a pre-existing storage value.
     */
    AnnouncementDepositFactor: PlainDescriptor<bigint>;
  };
  Multisig: {
    /**
     * The base amount of currency needed to reserve for creating a multisig execution or to
     * store a dispatch call for later.
     *
     * This is held for an additional storage item whose value size is
     * `4 + sizeof((BlockNumber, Balance, AccountId))` bytes and whose key size is
     * `32 + sizeof(AccountId)` bytes.
     */
    DepositBase: PlainDescriptor<bigint>;
    /**
     * The amount of currency needed per unit threshold when creating a multisig execution.
     *
     * This is held for adding 32 bytes more into a pre-existing storage value.
     */
    DepositFactor: PlainDescriptor<bigint>;
    /**
     * The maximum amount of signatories allowed in the multisig.
     */
    MaxSignatories: PlainDescriptor<number>;
  };
  Bounties: {
    /**
     * The amount held on deposit for placing a bounty proposal.
     */
    BountyDepositBase: PlainDescriptor<bigint>;
    /**
     * The delay period for which a bounty beneficiary need to wait before claim the payout.
     */
    BountyDepositPayoutDelay: PlainDescriptor<number>;
    /**
     * Bounty duration in blocks.
     */
    BountyUpdatePeriod: PlainDescriptor<number>;
    /**
     * The curator deposit is calculated as a percentage of the curator fee.
     *
     * This deposit has optional upper and lower bounds with `CuratorDepositMax` and
     * `CuratorDepositMin`.
     */
    CuratorDepositMultiplier: PlainDescriptor<number>;
    /**
     * Maximum amount of funds that should be placed in a deposit for making a proposal.
     */
    CuratorDepositMax: PlainDescriptor<Anonymize<I35p85j063s0il>>;
    /**
     * Minimum amount of funds that should be placed in a deposit for making a proposal.
     */
    CuratorDepositMin: PlainDescriptor<Anonymize<I35p85j063s0il>>;
    /**
     * Minimum value for a bounty.
     */
    BountyValueMinimum: PlainDescriptor<bigint>;
    /**
     * The amount held on deposit per byte within the tip report reason or bounty description.
     */
    DataDepositPerByte: PlainDescriptor<bigint>;
    /**
     * Maximum acceptable reason length.
     *
     * Benchmarks depend on this value, be sure to update weights file when changing this value
     */
    MaximumReasonLength: PlainDescriptor<number>;
  };
  ChildBounties: {
    /**
     * Maximum number of child bounties that can be added to a parent bounty.
     */
    MaxActiveChildBountyCount: PlainDescriptor<number>;
    /**
     * Minimum value for a child-bounty.
     */
    ChildBountyValueMinimum: PlainDescriptor<bigint>;
  };
  ElectionProviderMultiPhase: {
    /**
     * The minimum amount of improvement to the solution score that defines a solution as
     * "better" in the Signed phase.
     */
    BetterSignedThreshold: PlainDescriptor<number>;
    /**
     * The repeat threshold of the offchain worker.
     *
     * For example, if it is 5, that means that at least 5 blocks will elapse between attempts
     * to submit the worker's solution.
     */
    OffchainRepeat: PlainDescriptor<number>;
    /**
     * The priority of the unsigned transaction submitted in the unsigned-phase
     */
    MinerTxPriority: PlainDescriptor<bigint>;
    /**
     * Maximum number of signed submissions that can be queued.
     *
     * It is best to avoid adjusting this during an election, as it impacts downstream data
     * structures. In particular, `SignedSubmissionIndices<T>` is bounded on this value. If you
     * update this value during an election, you _must_ ensure that
     * `SignedSubmissionIndices.len()` is less than or equal to the new value. Otherwise,
     * attempts to submit new solutions may cause a runtime panic.
     */
    SignedMaxSubmissions: PlainDescriptor<number>;
    /**
     * Maximum weight of a signed solution.
     *
     * If [`Config::MinerConfig`] is being implemented to submit signed solutions (outside of
     * this pallet), then [`MinerConfig::solution_weight`] is used to compare against
     * this value.
     */
    SignedMaxWeight: PlainDescriptor<Anonymize<I4q39t5hn830vp>>;
    /**
     * The maximum amount of unchecked solutions to refund the call fee for.
     */
    SignedMaxRefunds: PlainDescriptor<number>;
    /**
     * Base reward for a signed solution
     */
    SignedRewardBase: PlainDescriptor<bigint>;
    /**
     * Per-byte deposit for a signed solution.
     */
    SignedDepositByte: PlainDescriptor<bigint>;
    /**
     * Per-weight deposit for a signed solution.
     */
    SignedDepositWeight: PlainDescriptor<bigint>;
    /**
     * The maximum number of winners that can be elected by this `ElectionProvider`
     * implementation.
     *
     * Note: This must always be greater or equal to `T::DataProvider::desired_targets()`.
     */
    MaxWinners: PlainDescriptor<number>;
    /**
        
         */
    MinerMaxLength: PlainDescriptor<number>;
    /**
        
         */
    MinerMaxWeight: PlainDescriptor<Anonymize<I4q39t5hn830vp>>;
    /**
        
         */
    MinerMaxVotesPerVoter: PlainDescriptor<number>;
    /**
        
         */
    MinerMaxWinners: PlainDescriptor<number>;
  };
  Nis: {
    /**
     * The treasury's pallet id, used for deriving its sovereign account ID.
     */
    PalletId: PlainDescriptor<FixedSizeBinary<8>>;
    /**
     * Number of duration queues in total. This sets the maximum duration supported, which is
     * this value multiplied by `Period`.
     */
    QueueCount: PlainDescriptor<number>;
    /**
     * Maximum number of items that may be in each duration queue.
     *
     * Must be larger than zero.
     */
    MaxQueueLen: PlainDescriptor<number>;
    /**
     * Portion of the queue which is free from ordering and just a FIFO.
     *
     * Must be no greater than `MaxQueueLen`.
     */
    FifoQueueLen: PlainDescriptor<number>;
    /**
     * The base period for the duration queues. This is the common multiple across all
     * supported freezing durations that can be bid upon.
     */
    BasePeriod: PlainDescriptor<number>;
    /**
     * The minimum amount of funds that may be placed in a bid. Note that this
     * does not actually limit the amount which may be represented in a receipt since bids may
     * be split up by the system.
     *
     * It should be at least big enough to ensure that there is no possible storage spam attack
     * or queue-filling attack.
     */
    MinBid: PlainDescriptor<bigint>;
    /**
     * The minimum amount of funds which may intentionally be left remaining under a single
     * receipt.
     */
    MinReceipt: PlainDescriptor<bigint>;
    /**
     * The number of blocks between consecutive attempts to dequeue bids and create receipts.
     *
     * A larger value results in fewer storage hits each block, but a slower period to get to
     * the target.
     */
    IntakePeriod: PlainDescriptor<number>;
    /**
     * The maximum amount of bids that can consolidated into receipts in a single intake. A
     * larger value here means less of the block available for transactions should there be a
     * glut of bids.
     */
    MaxIntakeWeight: PlainDescriptor<Anonymize<I4q39t5hn830vp>>;
    /**
     * The maximum proportion which may be thawed and the period over which it is reset.
     */
    ThawThrottle: PlainDescriptor<Anonymize<I6cs1itejju2vv>>;
  };
  NisCounterpartBalances: {
    /**
     * The minimum amount required to keep an account open. MUST BE GREATER THAN ZERO!
     *
     * If you *really* need it to be zero, you can enable the feature `insecure_zero_ed` for
     * this pallet. However, you do so at your own risk: this will open up a major DoS vector.
     * In case you have multiple sources of provider references, you may also get unexpected
     * behaviour if you set this to zero.
     *
     * Bottom line: Do yourself a favour and make it at least one!
     */
    ExistentialDeposit: PlainDescriptor<bigint>;
    /**
     * The maximum number of locks that should exist on an account.
     * Not strictly enforced, but used for weight estimation.
     *
     * Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    MaxLocks: PlainDescriptor<number>;
    /**
     * The maximum number of named reserves that can exist on an account.
     *
     * Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    MaxReserves: PlainDescriptor<number>;
    /**
     * The maximum number of individual freeze locks that can exist on an account at any time.
     */
    MaxFreezes: PlainDescriptor<number>;
  };
  VoterList: {
    /**
     * The list of thresholds separating the various bags.
     *
     * Ids are separated into unsorted bags according to their score. This specifies the
     * thresholds separating the bags. An id's bag is the largest bag for which the id's score
     * is less than or equal to its upper threshold.
     *
     * When ids are iterated, higher bags are iterated completely before lower bags. This means
     * that iteration is _semi-sorted_: ids of higher score tend to come before ids of lower
     * score, but peer ids within a particular bag are sorted in insertion order.
     *
     * # Expressing the constant
     *
     * This constant must be sorted in strictly increasing order. Duplicate items are not
     * permitted.
     *
     * There is an implied upper limit of `Score::MAX`; that value does not need to be
     * specified within the bag. For any two threshold lists, if one ends with
     * `Score::MAX`, the other one does not, and they are otherwise equal, the two
     * lists will behave identically.
     *
     * # Calculation
     *
     * It is recommended to generate the set of thresholds in a geometric series, such that
     * there exists some constant ratio such that `threshold[k + 1] == (threshold[k] *
     * constant_ratio).max(threshold[k] + 1)` for all `k`.
     *
     * The helpers in the `/utils/frame/generate-bags` module can simplify this calculation.
     *
     * # Examples
     *
     * - If `BagThresholds::get().is_empty()`, then all ids are put into the same bag, and
     * iteration is strictly in insertion order.
     * - If `BagThresholds::get().len() == 64`, and the thresholds are determined according to
     * the procedure given above, then the constant ratio is equal to 2.
     * - If `BagThresholds::get().len() == 200`, and the thresholds are determined according to
     * the procedure given above, then the constant ratio is approximately equal to 1.248.
     * - If the threshold list begins `[1, 2, 3, ...]`, then an id with score 0 or 1 will fall
     * into bag 0, an id with score 2 will fall into bag 1, etc.
     *
     * # Migration
     *
     * In the event that this list ever changes, a copy of the old bags list must be retained.
     * With that `List::migrate` can be called, which will perform the appropriate migration.
     */
    BagThresholds: PlainDescriptor<Anonymize<Iafqnechp3omqg>>;
  };
  NominationPools: {
    /**
     * The nomination pool's pallet id.
     */
    PalletId: PlainDescriptor<FixedSizeBinary<8>>;
    /**
     * The maximum pool points-to-balance ratio that an `open` pool can have.
     *
     * This is important in the event slashing takes place and the pool's points-to-balance
     * ratio becomes disproportional.
     *
     * Moreover, this relates to the `RewardCounter` type as well, as the arithmetic operations
     * are a function of number of points, and by setting this value to e.g. 10, you ensure
     * that the total number of points in the system are at most 10 times the total_issuance of
     * the chain, in the absolute worse case.
     *
     * For a value of 10, the threshold would be a pool points-to-balance ratio of 10:1.
     * Such a scenario would also be the equivalent of the pool being 90% slashed.
     */
    MaxPointsToBalance: PlainDescriptor<number>;
    /**
     * The maximum number of simultaneous unbonding chunks that can exist per member.
     */
    MaxUnbonding: PlainDescriptor<number>;
  };
  FastUnstake: {
    /**
     * Deposit to take for unstaking, to make sure we're able to slash the it in order to cover
     * the costs of resources on unsuccessful unstake.
     */
    Deposit: PlainDescriptor<bigint>;
  };
  DelegatedStaking: {
    /**
     * Injected identifier for the pallet.
     */
    PalletId: PlainDescriptor<FixedSizeBinary<8>>;
    /**
     * Fraction of the slash that is rewarded to the caller of pending slash to the agent.
     */
    SlashRewardFraction: PlainDescriptor<number>;
  };
  Paras: {
    /**
        
         */
    UnsignedPriority: PlainDescriptor<bigint>;
  };
  OnDemandAssignmentProvider: {
    /**
     * The default value for the spot traffic multiplier.
     */
    TrafficDefaultValue: PlainDescriptor<bigint>;
    /**
     * The maximum number of blocks some historical revenue
     * information stored for.
     */
    MaxHistoricalRevenue: PlainDescriptor<number>;
    /**
     * Identifier for the internal revenue balance.
     */
    PalletId: PlainDescriptor<FixedSizeBinary<8>>;
  };
  Registrar: {
    /**
     * The deposit to be paid to run a on-demand parachain.
     * This should include the cost for storing the genesis head and validation code.
     */
    ParaDeposit: PlainDescriptor<bigint>;
    /**
     * The deposit to be paid per byte stored on chain.
     */
    DataDepositPerByte: PlainDescriptor<bigint>;
  };
  Slots: {
    /**
     * The number of blocks over which a single period lasts.
     */
    LeasePeriod: PlainDescriptor<number>;
    /**
     * The number of blocks to offset each lease period by.
     */
    LeaseOffset: PlainDescriptor<number>;
  };
  Auctions: {
    /**
     * The number of blocks over which an auction may be retroactively ended.
     */
    EndingPeriod: PlainDescriptor<number>;
    /**
     * The length of each sample to take during the ending period.
     *
     * `EndingPeriod` / `SampleLength` = Total # of Samples
     */
    SampleLength: PlainDescriptor<number>;
    /**
        
         */
    SlotRangeCount: PlainDescriptor<number>;
    /**
        
         */
    LeasePeriodsPerSlot: PlainDescriptor<number>;
  };
  Crowdloan: {
    /**
     * `PalletId` for the crowdloan pallet. An appropriate value could be
     * `PalletId(*b"py/cfund")`
     */
    PalletId: PlainDescriptor<FixedSizeBinary<8>>;
    /**
     * The minimum amount that may be contributed into a crowdloan. Should almost certainly be
     * at least `ExistentialDeposit`.
     */
    MinContribution: PlainDescriptor<bigint>;
    /**
     * Max number of storage keys to remove per extrinsic call.
     */
    RemoveKeysLimit: PlainDescriptor<number>;
  };
  Coretime: {
    /**
     * The ParaId of the coretime chain.
     */
    BrokerId: PlainDescriptor<number>;
    /**
     * The coretime chain pot location.
     */
    BrokerPotLocation: PlainDescriptor<XcmV3Junctions>;
  };
  MessageQueue: {
    /**
     * The size of the page; this implies the maximum message size which can be sent.
     *
     * A good value depends on the expected message sizes, their weights, the weight that is
     * available for processing them and the maximal needed message size. The maximal message
     * size is slightly lower than this as defined by [`MaxMessageLenOf`].
     */
    HeapSize: PlainDescriptor<number>;
    /**
     * The maximum number of stale pages (i.e. of overweight messages) allowed before culling
     * can happen. Once there are more stale pages than this, then historical pages may be
     * dropped, even if they contain unprocessed overweight messages.
     */
    MaxStale: PlainDescriptor<number>;
    /**
     * The amount of weight (if any) which should be provided to the message queue for
     * servicing enqueued items `on_initialize`.
     *
     * This may be legitimately `None` in the case that you will call
     * `ServiceQueues::service_queues` manually or set [`Self::IdleMaxServiceWeight`] to have
     * it run in `on_idle`.
     */
    ServiceWeight: PlainDescriptor<Anonymize<Iasb8k6ash5mjn>>;
    /**
     * The maximum amount of weight (if any) to be used from remaining weight `on_idle` which
     * should be provided to the message queue for servicing enqueued items `on_idle`.
     * Useful for parachains to process messages at the same block they are received.
     *
     * If `None`, it will not call `ServiceQueues::service_queues` in `on_idle`.
     */
    IdleMaxServiceWeight: PlainDescriptor<Anonymize<Iasb8k6ash5mjn>>;
  };
  Beefy: {
    /**
     * The maximum number of authorities that can be added.
     */
    MaxAuthorities: PlainDescriptor<number>;
    /**
     * The maximum number of nominators for each validator.
     */
    MaxNominators: PlainDescriptor<number>;
    /**
     * The maximum number of entries to keep in the set id to session index mapping.
     *
     * Since the `SetIdSession` map is only used for validating equivocations this
     * value should relate to the bonding duration of whatever staking system is
     * being used (if any). If equivocation handling is not enabled then this value
     * can be zero.
     */
    MaxSetIdSessionEntries: PlainDescriptor<bigint>;
  };
};
type IViewFns = {};
type IRuntimeCalls = {
  /**
    
     */
  Inflation: {
    /**
     * Return the current estimates of the inflation amount.
     *
     * This is marked as experimental in light of RFC#89. Nonetheless, its usage is highly
     * recommended over trying to read-storage, or re-create the onchain logic.
     */
    experimental_inflation_prediction_info: RuntimeDescriptor<[], Anonymize<I3he5stuuhiokq>>;
  };
  /**
   * The `Core` runtime api that every Substrate runtime needs to implement.
   */
  Core: {
    /**
     * Returns the version of the runtime.
     */
    version: RuntimeDescriptor<[], Anonymize<Ic6nglu2db2c36>>;
    /**
     * Execute the given block.
     */
    execute_block: RuntimeDescriptor<[block: Anonymize<Iaqet9jc3ihboe>], undefined>;
    /**
     * Initialize a block with the given header and return the runtime executive mode.
     */
    initialize_block: RuntimeDescriptor<
      [header: Anonymize<Ic952bubvq4k7d>],
      Anonymize<I2v50gu3s1aqk6>
    >;
  };
  /**
   * The `Metadata` api trait that returns metadata for the runtime.
   */
  Metadata: {
    /**
     * Returns the metadata of a runtime.
     */
    metadata: RuntimeDescriptor<[], Binary>;
    /**
     * Returns the metadata at a given version.
     *
     * If the given `version` isn't supported, this will return `None`.
     * Use [`Self::metadata_versions`] to find out about supported metadata version of the runtime.
     */
    metadata_at_version: RuntimeDescriptor<[version: number], Anonymize<Iabpgqcjikia83>>;
    /**
     * Returns the supported metadata versions.
     *
     * This can be used to call `metadata_at_version`.
     */
    metadata_versions: RuntimeDescriptor<[], Anonymize<Icgljjb6j82uhn>>;
  };
  /**
   * The `BlockBuilder` api trait that provides the required functionality for building a block.
   */
  BlockBuilder: {
    /**
     * Apply the given extrinsic.
     *
     * Returns an inclusion outcome which specifies if this extrinsic is included in
     * this block or not.
     */
    apply_extrinsic: RuntimeDescriptor<[extrinsic: Binary], Anonymize<I6hjpshamknalo>>;
    /**
     * Finish the current block.
     */
    finalize_block: RuntimeDescriptor<[], Anonymize<Ic952bubvq4k7d>>;
    /**
     * Generate inherent extrinsics. The inherent data will vary from chain to chain.
     */
    inherent_extrinsics: RuntimeDescriptor<
      [inherent: Anonymize<If7uv525tdvv7a>],
      Anonymize<Itom7fk49o0c9>
    >;
    /**
     * Check that the inherents are valid. The inherent data will vary from chain to chain.
     */
    check_inherents: RuntimeDescriptor<
      [block: Anonymize<Iaqet9jc3ihboe>, data: Anonymize<If7uv525tdvv7a>],
      Anonymize<I2an1fs2eiebjp>
    >;
  };
  /**
   * The `TaggedTransactionQueue` api trait for interfering with the transaction queue.
   */
  TaggedTransactionQueue: {
    /**
     * Validate the transaction.
     *
     * This method is invoked by the transaction pool to learn details about given transaction.
     * The implementation should make sure to verify the correctness of the transaction
     * against current state. The given `block_hash` corresponds to the hash of the block
     * that is used as current state.
     *
     * Note that this call may be performed by the pool multiple times and transactions
     * might be verified in any possible order.
     */
    validate_transaction: RuntimeDescriptor<
      [source: TransactionValidityTransactionSource, tx: Binary, block_hash: FixedSizeBinary<32>],
      Anonymize<Iajbob6uln5jct>
    >;
  };
  /**
   * The offchain worker api.
   */
  OffchainWorkerApi: {
    /**
     * Starts the off-chain task for given block header.
     */
    offchain_worker: RuntimeDescriptor<[header: Anonymize<Ic952bubvq4k7d>], undefined>;
  };
  /**
   * The API for querying the state of parachains on-chain.
   */
  ParachainHost: {
    /**
     * Get the current validators.
     */
    validators: RuntimeDescriptor<[], Anonymize<Ic5m5lp1oioo8r>>;
    /**
     * Returns the validator groups and rotation info localized based on the hypothetical child
     * of a block whose state  this is invoked on. Note that `now` in the `GroupRotationInfo`
     * should be the successor of the number of the block.
     */
    validator_groups: RuntimeDescriptor<[], Anonymize<I5985kfq7sspta>>;
    /**
     * Yields information on all availability cores as relevant to the child block.
     * Cores are either free or occupied. Free cores can have paras assigned to them.
     */
    availability_cores: RuntimeDescriptor<[], Anonymize<I4jmodim0td97u>>;
    /**
     * Yields the persisted validation data for the given `ParaId` along with an assumption that
     * should be used if the para currently occupies a core.
     *
     * Returns `None` if either the para is not registered or the assumption is `Freed`
     * and the para already occupies a core.
     */
    persisted_validation_data: RuntimeDescriptor<
      [para_id: number, assumption: OccupiedCoreAssumption],
      Anonymize<I9kavsa730sjfr>
    >;
    /**
     * Returns the persisted validation data for the given `ParaId` along with the corresponding
     * validation code hash. Instead of accepting assumption about the para, matches the validation
     * data hash against an expected one and yields `None` if they're not equal.
     */
    assumed_validation_data: RuntimeDescriptor<
      [para_id: number, expected_persisted_validation_data_hash: FixedSizeBinary<32>],
      Anonymize<Ifn3gc8nc1jruq>
    >;
    /**
     * Checks if the given validation outputs pass the acceptance criteria.
     */
    check_validation_outputs: RuntimeDescriptor<
      [para_id: number, outputs: Anonymize<Ic1d4u2opv3fst>],
      boolean
    >;
    /**
     * Returns the session index expected at a child of the block.
     *
     * This can be used to instantiate a `SigningContext`.
     */
    session_index_for_child: RuntimeDescriptor<[], number>;
    /**
     * Fetch the validation code used by a para, making the given `OccupiedCoreAssumption`.
     *
     * Returns `None` if either the para is not registered or the assumption is `Freed`
     * and the para already occupies a core.
     */
    validation_code: RuntimeDescriptor<
      [para_id: number, assumption: OccupiedCoreAssumption],
      Anonymize<Iabpgqcjikia83>
    >;
    /**
     * Get the receipt of a candidate pending availability. This returns `Some` for any paras
     * assigned to occupied cores in `availability_cores` and `None` otherwise.
     */
    candidate_pending_availability: RuntimeDescriptor<[para_id: number], Anonymize<Ic5plng3kq7oc8>>;
    /**
     * Get a vector of events concerning candidates that occurred within a block.
     */
    candidate_events: RuntimeDescriptor<[], Anonymize<Iajdik7eaq7pn0>>;
    /**
     * Get all the pending inbound messages in the downward message queue for a para.
     */
    dmq_contents: RuntimeDescriptor<[recipient: number], Anonymize<I6ljjd4b5fa4ov>>;
    /**
     * Get the contents of all channels addressed to the given recipient. Channels that have no
     * messages in them are also included.
     */
    inbound_hrmp_channels_contents: RuntimeDescriptor<
      [recipient: number],
      Anonymize<I2pf0b05mc7sdr>
    >;
    /**
     * Get the validation code from its hash.
     */
    validation_code_by_hash: RuntimeDescriptor<
      [hash: FixedSizeBinary<32>],
      Anonymize<Iabpgqcjikia83>
    >;
    /**
     * Scrape dispute relevant from on-chain, backing votes and resolved disputes.
     */
    on_chain_votes: RuntimeDescriptor<[], Anonymize<I7n1him6iq79fv>>;
    /**
     * Get the session info for the given session, if stored.
     *
     * NOTE: This function is only available since parachain host version 2.
     */
    session_info: RuntimeDescriptor<[index: number], Anonymize<Ialuks4a6iupcs>>;
    /**
     * Submits a PVF pre-checking statement into the transaction pool.
     *
     * NOTE: This function is only available since parachain host version 2.
     */
    submit_pvf_check_statement: RuntimeDescriptor<
      [stmt: Anonymize<I36e6rra3ikq65>, signature: FixedSizeBinary<64>],
      undefined
    >;
    /**
     * Returns code hashes of PVFs that require pre-checking by validators in the active set.
     *
     * NOTE: This function is only available since parachain host version 2.
     */
    pvfs_require_precheck: RuntimeDescriptor<[], Anonymize<Ic5m5lp1oioo8r>>;
    /**
     * Fetch the hash of the validation code used by a para, making the given `OccupiedCoreAssumption`.
     *
     * NOTE: This function is only available since parachain host version 2.
     */
    validation_code_hash: RuntimeDescriptor<
      [para_id: number, assumption: OccupiedCoreAssumption],
      Anonymize<I4s6vifaf8k998>
    >;
    /**
     * Returns all onchain disputes.
     */
    disputes: RuntimeDescriptor<[], Anonymize<Idv6tqqnmb3i1j>>;
    /**
     * Returns execution parameters for the session.
     */
    session_executor_params: RuntimeDescriptor<[session_index: number], Anonymize<Iekan13fn586c2>>;
    /**
     * Returns a list of validators that lost a past session dispute and need to be slashed.
     * NOTE: This function is only available since parachain host version 5.
     */
    unapplied_slashes: RuntimeDescriptor<[], Anonymize<Idrp5a1qbbi2au>>;
    /**
     * Returns a merkle proof of a validator session key.
     * NOTE: This function is only available since parachain host version 5.
     */
    key_ownership_proof: RuntimeDescriptor<
      [validator_id: FixedSizeBinary<32>],
      Anonymize<Iabpgqcjikia83>
    >;
    /**
     * Submit an unsigned extrinsic to slash validators who lost a dispute about
     * a candidate of a past session.
     * NOTE: This function is only available since parachain host version 5.
     */
    submit_report_dispute_lost: RuntimeDescriptor<
      [dispute_proof: Anonymize<I943rhn463avqr>, key_ownership_proof: Binary],
      boolean
    >;
    /**
     * Get the minimum number of backing votes for a parachain candidate.
     * This is a staging method! Do not use on production runtimes!
     */
    minimum_backing_votes: RuntimeDescriptor<[], number>;
    /**
     * Returns the state of parachain backing for a given para.
     */
    para_backing_state: RuntimeDescriptor<[_: number], Anonymize<Iacuu7pfj40eo5>>;
    /**
     * Returns candidate's acceptance limitations for asynchronous backing for a relay parent.
     */
    async_backing_params: RuntimeDescriptor<[], Anonymize<Iavuvfkop6318c>>;
    /**
     * Returns a list of all disabled validators at the given block.
     */
    disabled_validators: RuntimeDescriptor<[], Anonymize<Icgljjb6j82uhn>>;
    /**
     * Get node features.
     * This is a staging method! Do not use on production runtimes!
     */
    node_features: RuntimeDescriptor<
      [],
      {
        bytes: Uint8Array;
        bitsLen: number;
      }
    >;
    /**
     * Approval voting configuration parameters
     */
    approval_voting_params: RuntimeDescriptor<[], number>;
    /**
     * Claim queue
     */
    claim_queue: RuntimeDescriptor<[], Anonymize<I9olhgo2o08h7b>>;
    /**
     * Elastic scaling support
     */
    candidates_pending_availability: RuntimeDescriptor<
      [para_id: number],
      Anonymize<I3cs5lehnlql7v>
    >;
  };
  /**
   * API necessary for BEEFY voters.
   */
  BeefyApi: {
    /**
     * Return the block number where BEEFY consensus is enabled/started
     */
    beefy_genesis: RuntimeDescriptor<[], Anonymize<I4arjljr6dpflb>>;
    /**
     * Return the current active BEEFY validator set
     */
    validator_set: RuntimeDescriptor<[], Anonymize<Ifogo2hpqpe6b4>>;
    /**
     * Submits an unsigned extrinsic to report a double voting equivocation. The caller
     * must provide the double voting proof and a key ownership proof
     * (should be obtained using `generate_key_ownership_proof`). The
     * extrinsic will be unsigned and should only be accepted for local
     * authorship (not to be broadcast to the network). This method returns
     * `None` when creation of the extrinsic fails, e.g. if equivocation
     * reporting is disabled for the given runtime (i.e. this method is
     * hardcoded to return `None`). Only useful in an offchain context.
     */
    submit_report_double_voting_unsigned_extrinsic: RuntimeDescriptor<
      [equivocation_proof: Anonymize<Ifiofttj73fsk1>, key_owner_proof: Binary],
      boolean
    >;
    /**
     * Submits an unsigned extrinsic to report a fork voting equivocation. The caller
     * must provide the fork voting proof (the ancestry proof should be obtained using
     * `generate_ancestry_proof`) and a key ownership proof (should be obtained using
     * `generate_key_ownership_proof`). The extrinsic will be unsigned and should only
     * be accepted for local authorship (not to be broadcast to the network). This method
     * returns `None` when creation of the extrinsic fails, e.g. if equivocation
     * reporting is disabled for the given runtime (i.e. this method is
     * hardcoded to return `None`). Only useful in an offchain context.
     */
    submit_report_fork_voting_unsigned_extrinsic: RuntimeDescriptor<
      [equivocation_proof: Anonymize<I25plekc1moieu>, key_owner_proof: Binary],
      boolean
    >;
    /**
     * Submits an unsigned extrinsic to report a future block voting equivocation. The caller
     * must provide the future block voting proof and a key ownership proof
     * (should be obtained using `generate_key_ownership_proof`).
     * The extrinsic will be unsigned and should only be accepted for local
     * authorship (not to be broadcast to the network). This method returns
     * `None` when creation of the extrinsic fails, e.g. if equivocation
     * reporting is disabled for the given runtime (i.e. this method is
     * hardcoded to return `None`). Only useful in an offchain context.
     */
    submit_report_future_block_voting_unsigned_extrinsic: RuntimeDescriptor<
      [equivocation_proof: Anonymize<I3eao7ea0kppv8>, key_owner_proof: Binary],
      boolean
    >;
    /**
     * Generates a proof of key ownership for the given authority in the
     * given set. An example usage of this module is coupled with the
     * session historical module to prove that a given authority key is
     * tied to a given staking identity during a specific session. Proofs
     * of key ownership are necessary for submitting equivocation reports.
     * NOTE: even though the API takes a `set_id` as parameter the current
     * implementations ignores this parameter and instead relies on this
     * method being called at the correct block height, i.e. any point at
     * which the given set id is live on-chain. Future implementations will
     * instead use indexed data through an offchain worker, not requiring
     * older states to be available.
     */
    generate_key_ownership_proof: RuntimeDescriptor<
      [set_id: bigint, authority_id: FixedSizeBinary<33>],
      Anonymize<Iabpgqcjikia83>
    >;
    /**
     * Generates a proof that the `prev_block_number` is part of the canonical chain at
     * `best_known_block_number`.
     */
    generate_ancestry_proof: RuntimeDescriptor<
      [prev_block_number: number, best_known_block_number: Anonymize<I4arjljr6dpflb>],
      Anonymize<Iabpgqcjikia83>
    >;
  };
  /**
   * API to interact with MMR pallet.
   */
  MmrApi: {
    /**
     * Return the on-chain MMR root hash.
     */
    mmr_root: RuntimeDescriptor<[], Anonymize<I7rj2bnb76oko1>>;
    /**
     * Return the number of MMR blocks in the chain.
     */
    mmr_leaf_count: RuntimeDescriptor<[], Anonymize<I4o356o7eq06ms>>;
    /**
     * Generate MMR proof for a series of block numbers. If `best_known_block_number = Some(n)`,
     * use historical MMR state at given block height `n`. Else, use current MMR state.
     */
    generate_proof: RuntimeDescriptor<
      [
        block_numbers: Anonymize<Icgljjb6j82uhn>,
        best_known_block_number: Anonymize<I4arjljr6dpflb>,
      ],
      Anonymize<I46e127tr8ma2h>
    >;
    /**
     * Verify MMR proof against on-chain MMR for a batch of leaves.
     *
     * Note this function will use on-chain MMR root hash and check if the proof matches the hash.
     * Note, the leaves should be sorted such that corresponding leaves and leaf indices have the
     * same position in both the `leaves` vector and the `leaf_indices` vector contained in the [LeafProof]
     */
    verify_proof: RuntimeDescriptor<
      [leaves: Anonymize<Itom7fk49o0c9>, proof: Anonymize<I38ee9is0n4jn9>],
      Anonymize<Ie88mmnuvmuvp5>
    >;
    /**
     * Verify MMR proof against given root hash for a batch of leaves.
     *
     * Note this function does not require any on-chain storage - the
     * proof is verified against given MMR root hash.
     *
     * Note, the leaves should be sorted such that corresponding leaves and leaf indices have the
     * same position in both the `leaves` vector and the `leaf_indices` vector contained in the [LeafProof]
     */
    verify_proof_stateless: RuntimeDescriptor<
      [
        root: FixedSizeBinary<32>,
        leaves: Anonymize<Itom7fk49o0c9>,
        proof: Anonymize<I38ee9is0n4jn9>,
      ],
      Anonymize<Ie88mmnuvmuvp5>
    >;
  };
  /**
   * API useful for BEEFY light clients.
   */
  BeefyMmrApi: {
    /**
     * Return the currently active BEEFY authority set proof.
     */
    authority_set_proof: RuntimeDescriptor<[], Anonymize<Idjett00s2gd>>;
    /**
     * Return the next/queued BEEFY authority set proof.
     */
    next_authority_set_proof: RuntimeDescriptor<[], Anonymize<Idjett00s2gd>>;
  };
  /**
   * APIs for integrating the GRANDPA finality gadget into runtimes.
   * This should be implemented on the runtime side.
   *
   * This is primarily used for negotiating authority-set changes for the
   * gadget. GRANDPA uses a signaling model of changing authority sets:
   * changes should be signaled with a delay of N blocks, and then automatically
   * applied in the runtime after those N blocks have passed.
   *
   * The consensus protocol will coordinate the handoff externally.
   */
  GrandpaApi: {
    /**
     * Get the current GRANDPA authorities and weights. This should not change except
     * for when changes are scheduled and the corresponding delay has passed.
     *
     * When called at block B, it will return the set of authorities that should be
     * used to finalize descendants of this block (B+1, B+2, ...). The block B itself
     * is finalized by the authorities from block B-1.
     */
    grandpa_authorities: RuntimeDescriptor<[], Anonymize<I3geksg000c171>>;
    /**
     * Submits an unsigned extrinsic to report an equivocation. The caller
     * must provide the equivocation proof and a key ownership proof
     * (should be obtained using `generate_key_ownership_proof`). The
     * extrinsic will be unsigned and should only be accepted for local
     * authorship (not to be broadcast to the network). This method returns
     * `None` when creation of the extrinsic fails, e.g. if equivocation
     * reporting is disabled for the given runtime (i.e. this method is
     * hardcoded to return `None`). Only useful in an offchain context.
     */
    submit_report_equivocation_unsigned_extrinsic: RuntimeDescriptor<
      [equivocation_proof: Anonymize<I9puqgoda8ofk4>, key_owner_proof: Binary],
      boolean
    >;
    /**
     * Generates a proof of key ownership for the given authority in the
     * given set. An example usage of this module is coupled with the
     * session historical module to prove that a given authority key is
     * tied to a given staking identity during a specific session. Proofs
     * of key ownership are necessary for submitting equivocation reports.
     * NOTE: even though the API takes a `set_id` as parameter the current
     * implementations ignore this parameter and instead rely on this
     * method being called at the correct block height, i.e. any point at
     * which the given set id is live on-chain. Future implementations will
     * instead use indexed data through an offchain worker, not requiring
     * older states to be available.
     */
    generate_key_ownership_proof: RuntimeDescriptor<
      [set_id: bigint, authority_id: FixedSizeBinary<32>],
      Anonymize<Iabpgqcjikia83>
    >;
    /**
     * Get current GRANDPA authority set id.
     */
    current_set_id: RuntimeDescriptor<[], bigint>;
  };
  /**
   * API necessary for block authorship with BABE.
   */
  BabeApi: {
    /**
     * Return the configuration for BABE.
     */
    configuration: RuntimeDescriptor<[], Anonymize<Iems84l8lk2v0c>>;
    /**
     * Returns the slot that started the current epoch.
     */
    current_epoch_start: RuntimeDescriptor<[], bigint>;
    /**
     * Returns information regarding the current epoch.
     */
    current_epoch: RuntimeDescriptor<[], Anonymize<I1r5ke30ueqo0r>>;
    /**
     * Returns information regarding the next epoch (which was already
     * previously announced).
     */
    next_epoch: RuntimeDescriptor<[], Anonymize<I1r5ke30ueqo0r>>;
    /**
     * Generates a proof of key ownership for the given authority in the
     * current epoch. An example usage of this module is coupled with the
     * session historical module to prove that a given authority key is
     * tied to a given staking identity during a specific session. Proofs
     * of key ownership are necessary for submitting equivocation reports.
     * NOTE: even though the API takes a `slot` as parameter the current
     * implementations ignores this parameter and instead relies on this
     * method being called at the correct block height, i.e. any point at
     * which the epoch for the given slot is live on-chain. Future
     * implementations will instead use indexed data through an offchain
     * worker, not requiring older states to be available.
     */
    generate_key_ownership_proof: RuntimeDescriptor<
      [slot: bigint, authority_id: FixedSizeBinary<32>],
      Anonymize<Iabpgqcjikia83>
    >;
    /**
     * Submits an unsigned extrinsic to report an equivocation. The caller
     * must provide the equivocation proof and a key ownership proof
     * (should be obtained using `generate_key_ownership_proof`). The
     * extrinsic will be unsigned and should only be accepted for local
     * authorship (not to be broadcast to the network). This method returns
     * `None` when creation of the extrinsic fails, e.g. if equivocation
     * reporting is disabled for the given runtime (i.e. this method is
     * hardcoded to return `None`). Only useful in an offchain context.
     */
    submit_report_equivocation_unsigned_extrinsic: RuntimeDescriptor<
      [equivocation_proof: Anonymize<I68ii5ik8avr9o>, key_owner_proof: Binary],
      boolean
    >;
  };
  /**
   * The authority discovery api.
   *
   * This api is used by the `client/authority-discovery` module to retrieve identifiers
   * of the current and next authority set.
   */
  AuthorityDiscoveryApi: {
    /**
     * Retrieve authority identifiers of the current and next authority set.
     */
    authorities: RuntimeDescriptor<[], Anonymize<Ic5m5lp1oioo8r>>;
  };
  /**
   * Session keys runtime api.
   */
  SessionKeys: {
    /**
     * Generate a set of session keys with optionally using the given seed.
     * The keys should be stored within the keystore exposed via runtime
     * externalities.
     *
     * The seed needs to be a valid `utf8` string.
     *
     * Returns the concatenated SCALE encoded public keys.
     */
    generate_session_keys: RuntimeDescriptor<[seed: Anonymize<Iabpgqcjikia83>], Binary>;
    /**
     * Decode the given public session keys.
     *
     * Returns the list of public raw public keys + key type.
     */
    decode_session_keys: RuntimeDescriptor<[encoded: Binary], Anonymize<Icerf8h8pdu8ss>>;
  };
  /**
   * The API to query account nonce.
   */
  AccountNonceApi: {
    /**
     * Get current account nonce of given `AccountId`.
     */
    account_nonce: RuntimeDescriptor<[account: SS58String], number>;
  };
  /**
    
     */
  TransactionPaymentApi: {
    /**
        
         */
    query_info: RuntimeDescriptor<[uxt: Binary, len: number], Anonymize<I6spmpef2c7svf>>;
    /**
        
         */
    query_fee_details: RuntimeDescriptor<[uxt: Binary, len: number], Anonymize<Iei2mvq0mjvt81>>;
    /**
        
         */
    query_weight_to_fee: RuntimeDescriptor<[weight: Anonymize<I4q39t5hn830vp>], bigint>;
    /**
        
         */
    query_length_to_fee: RuntimeDescriptor<[length: number], bigint>;
  };
  /**
    
     */
  TransactionPaymentCallApi: {
    /**
     * Query information of a dispatch class, weight, and fee of a given encoded `Call`.
     */
    query_call_info: RuntimeDescriptor<
      [call: Anonymize<Iaknq33hc05bq4>, len: number],
      Anonymize<I6spmpef2c7svf>
    >;
    /**
     * Query fee details of a given encoded `Call`.
     */
    query_call_fee_details: RuntimeDescriptor<
      [call: Anonymize<Iaknq33hc05bq4>, len: number],
      Anonymize<Iei2mvq0mjvt81>
    >;
    /**
     * Query the output of the current `WeightToFee` given some input.
     */
    query_weight_to_fee: RuntimeDescriptor<[weight: Anonymize<I4q39t5hn830vp>], bigint>;
    /**
     * Query the output of the current `LengthToFee` given some input.
     */
    query_length_to_fee: RuntimeDescriptor<[length: number], bigint>;
  };
  /**
   * A trait of XCM payment API.
   *
   * API provides functionality for obtaining:
   *
   * * the weight required to execute an XCM message,
   * * a list of acceptable `AssetId`s for message execution payment,
   * * the cost of the weight in the specified acceptable `AssetId`.
   * * the fees for an XCM message delivery.
   *
   * To determine the execution weight of the calls required for
   * [`xcm::latest::Instruction::Transact`] instruction, `TransactionPaymentCallApi` can be used.
   */
  XcmPaymentApi: {
    /**
     * Returns a list of acceptable payment assets.
     *
     * # Arguments
     *
     * * `xcm_version`: Version.
     */
    query_acceptable_payment_assets: RuntimeDescriptor<
      [xcm_version: number],
      Anonymize<I1p1369d52j8jd>
    >;
    /**
     * Returns a weight needed to execute a XCM.
     *
     * # Arguments
     *
     * * `message`: `VersionedXcm`.
     */
    query_xcm_weight: RuntimeDescriptor<[message: DotXcmVersionedXcm], Anonymize<Ic0c3req3mlc1l>>;
    /**
     * Converts a weight into a fee for the specified `AssetId`.
     *
     * # Arguments
     *
     * * `weight`: convertible `Weight`.
     * * `asset`: `VersionedAssetId`.
     */
    query_weight_to_asset_fee: RuntimeDescriptor<
      [weight: Anonymize<I4q39t5hn830vp>, asset: DotXcmVersionedAssetId],
      Anonymize<I7ocn4njqde3v5>
    >;
    /**
     * Get delivery fees for sending a specific `message` to a `destination`.
     * These always come in a specific asset, defined by the chain.
     *
     * # Arguments
     * * `message`: The message that'll be sent, necessary because most delivery fees are based on the
     * size of the message.
     * * `destination`: The destination to send the message to. Different destinations may use
     * different senders that charge different fees.
     */
    query_delivery_fees: RuntimeDescriptor<
      [destination: DotXcmVersionedLocation, message: DotXcmVersionedXcm],
      Anonymize<I5rlt6h8ph553n>
    >;
  };
  /**
   * API for dry-running extrinsics and XCM programs to get the programs that need to be passed to the fees API.
   *
   * All calls return a vector of tuples (location, xcm) where each "xcm" is executed in "location".
   * If there's local execution, the location will be "Here".
   * This vector can be used to calculate both execution and delivery fees.
   *
   * Calls or XCMs might fail when executed, this doesn't mean the result of these calls will be an `Err`.
   * In those cases, there might still be a valid result, with the execution error inside it.
   * The only reasons why these calls might return an error are listed in the [`Error`] enum.
   */
  DryRunApi: {
    /**
     * Dry run call.
     */
    dry_run_call: RuntimeDescriptor<
      [origin: Anonymize<I575vh6g119dum>, call: Anonymize<Iaknq33hc05bq4>],
      Anonymize<I3q0jpjpeplml8>
    >;
    /**
     * Dry run XCM program
     */
    dry_run_xcm: RuntimeDescriptor<
      [origin_location: DotXcmVersionedLocation, xcm: DotXcmVersionedXcm],
      Anonymize<Ib7gh0ou2d5j8s>
    >;
  };
  /**
   * API for useful conversions between XCM `Location` and `AccountId`.
   */
  LocationToAccountApi: {
    /**
     * Converts `Location` to `AccountId`.
     */
    convert_location: RuntimeDescriptor<
      [location: DotXcmVersionedLocation],
      Anonymize<Ieh6nis3hdbtgi>
    >;
  };
  /**
   * Runtime api for accessing information about nomination pools.
   */
  NominationPoolsApi: {
    /**
     * Returns the pending rewards for the member that the AccountId was given for.
     */
    pending_rewards: RuntimeDescriptor<[who: SS58String], bigint>;
    /**
     * Returns the equivalent balance of `points` for a given pool.
     */
    points_to_balance: RuntimeDescriptor<[pool_id: number, points: bigint], bigint>;
    /**
     * Returns the equivalent points of `new_funds` for a given pool.
     */
    balance_to_points: RuntimeDescriptor<[pool_id: number, new_funds: bigint], bigint>;
    /**
     * Returns the pending slash for a given pool.
     */
    pool_pending_slash: RuntimeDescriptor<[pool_id: number], bigint>;
    /**
     * Returns the pending slash for a given pool member.
     *
     * If pending slash of the member exceeds `ExistentialDeposit`, it can be reported on
     * chain.
     */
    member_pending_slash: RuntimeDescriptor<[member: SS58String], bigint>;
    /**
     * Returns true if the pool with `pool_id` needs migration.
     *
     * This can happen when the `pallet-nomination-pools` has switched to using strategy
     * [`DelegateStake`](pallet_nomination_pools::adapter::DelegateStake) but the pool
     * still has funds that were staked using the older strategy
     * [TransferStake](pallet_nomination_pools::adapter::TransferStake). Use
     * [`migrate_pool_to_delegate_stake`](pallet_nomination_pools::Call::migrate_pool_to_delegate_stake)
     * to migrate the pool.
     */
    pool_needs_delegate_migration: RuntimeDescriptor<[pool_id: number], boolean>;
    /**
     * Returns true if the delegated funds of the pool `member` needs migration.
     *
     * Once a pool has successfully migrated to the strategy
     * [`DelegateStake`](pallet_nomination_pools::adapter::DelegateStake), the funds of the
     * member can be migrated from pool account to the member's account. Use
     * [`migrate_delegation`](pallet_nomination_pools::Call::migrate_delegation)
     * to migrate the funds of the pool member.
     */
    member_needs_delegate_migration: RuntimeDescriptor<[member: SS58String], boolean>;
    /**
     * Returns the total contribution of a pool member including any balance that is unbonding.
     */
    member_total_balance: RuntimeDescriptor<[who: SS58String], bigint>;
    /**
     * Total balance contributed to the pool.
     */
    pool_balance: RuntimeDescriptor<[pool_id: number], bigint>;
  };
  /**
    
     */
  StakingApi: {
    /**
     * Returns the nominations quota for a nominator with a given balance.
     */
    nominations_quota: RuntimeDescriptor<[balance: bigint], number>;
    /**
     * Returns the page count of exposures for a validator `account` in a given era.
     */
    eras_stakers_page_count: RuntimeDescriptor<[era: number, account: SS58String], number>;
    /**
     * Returns true if validator `account` has pages to be claimed for the given era.
     */
    pending_rewards: RuntimeDescriptor<[era: number, account: SS58String], boolean>;
  };
  /**
   * API to interact with RuntimeGenesisConfig for the runtime
   */
  GenesisBuilder: {
    /**
     * Build `RuntimeGenesisConfig` from a JSON blob not using any defaults and store it in the
     * storage.
     *
     * In the case of a FRAME-based runtime, this function deserializes the full `RuntimeGenesisConfig` from the given JSON blob and
     * puts it into the storage. If the provided JSON blob is incorrect or incomplete or the
     * deserialization fails, an error is returned.
     *
     * Please note that provided JSON blob must contain all `RuntimeGenesisConfig` fields, no
     * defaults will be used.
     */
    build_state: RuntimeDescriptor<[json: Binary], Anonymize<Ie9sr1iqcg3cgm>>;
    /**
     * Returns a JSON blob representation of the built-in `RuntimeGenesisConfig` identified by
     * `id`.
     *
     * If `id` is `None` the function returns JSON blob representation of the default
     * `RuntimeGenesisConfig` struct of the runtime. Implementation must provide default
     * `RuntimeGenesisConfig`.
     *
     * Otherwise function returns a JSON representation of the built-in, named
     * `RuntimeGenesisConfig` preset identified by `id`, or `None` if such preset does not
     * exist. Returned `Vec<u8>` contains bytes of JSON blob (patch) which comprises a list of
     * (potentially nested) key-value pairs that are intended for customizing the default
     * runtime genesis config. The patch shall be merged (rfc7386) with the JSON representation
     * of the default `RuntimeGenesisConfig` to create a comprehensive genesis config that can
     * be used in `build_state` method.
     */
    get_preset: RuntimeDescriptor<[id: Anonymize<I1mqgk2tmnn9i2>], Anonymize<Iabpgqcjikia83>>;
    /**
     * Returns a list of identifiers for available builtin `RuntimeGenesisConfig` presets.
     *
     * The presets from the list can be queried with [`GenesisBuilder::get_preset`] method. If
     * no named presets are provided by the runtime the list is empty.
     */
    preset_names: RuntimeDescriptor<[], Anonymize<I6lr8sctk0bi4e>>;
  };
};
type IAsset = PlainDescriptor<void>;
export type KsmDispatchError = Anonymize<I406br9o9nfug0>;
type PalletsTypedef = {
  __storage: IStorage;
  __tx: ICalls;
  __event: IEvent;
  __error: IError;
  __const: IConstants;
  __view: IViewFns;
};
type IDescriptors = {
  descriptors: {
    pallets: PalletsTypedef;
    apis: IRuntimeCalls;
  } & Promise<any>;
  metadataTypes: Promise<Uint8Array>;
  asset: IAsset;
  getMetadata: () => Promise<Uint8Array>;
  genesis: string | undefined;
};
declare const _allDescriptors: IDescriptors;
export default _allDescriptors;
export type KsmApis = ApisFromDef<IRuntimeCalls>;
export type KsmQueries = QueryFromPalletsDef<PalletsTypedef>;
export type KsmCalls = TxFromPalletsDef<PalletsTypedef>;
export type KsmEvents = EventsFromPalletsDef<PalletsTypedef>;
export type KsmErrors = ErrorsFromPalletsDef<PalletsTypedef>;
export type KsmConstants = ConstFromPalletsDef<PalletsTypedef>;
export type KsmViewFns = ViewFnsFromPalletsDef<PalletsTypedef>;
export type KsmCallData = Anonymize<Iaknq33hc05bq4> & {
  value: {
    type: string;
  };
};
export type KsmWhitelistEntry =
  | PalletKey
  | ApiKey<IRuntimeCalls>
  | `query.${NestedKey<PalletsTypedef['__storage']>}`
  | `tx.${NestedKey<PalletsTypedef['__tx']>}`
  | `event.${NestedKey<PalletsTypedef['__event']>}`
  | `error.${NestedKey<PalletsTypedef['__error']>}`
  | `const.${NestedKey<PalletsTypedef['__const']>}`
  | `view.${NestedKey<PalletsTypedef['__view']>}`;
type PalletKey =
  `*.${keyof (IStorage & ICalls & IEvent & IError & IConstants & IRuntimeCalls & IViewFns)}`;
type NestedKey<D extends Record<string, Record<string, any>>> =
  | '*'
  | {
      [P in keyof D & string]:
        | `${P}.*`
        | {
            [N in keyof D[P] & string]: `${P}.${N}`;
          }[keyof D[P] & string];
    }[keyof D & string];
type ApiKey<D extends Record<string, Record<string, any>>> =
  | 'api.*'
  | {
      [P in keyof D & string]:
        | `api.${P}.*`
        | {
            [N in keyof D[P] & string]: `api.${P}.${N}`;
          }[keyof D[P] & string];
    }[keyof D & string];
