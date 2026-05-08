import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Attraction } from '../types';
import attractionsData from '../data/attractions.json';

interface NingxiaMapProps {
  onAttractionClick?: (attraction: Attraction) => void;
  selectedCity?: string | null;
  onCityClick?: (cityName: string) => void;
  filterType?: string;
}

const cityRegions = [
  {
    id: 'yinchuan',
    name: '银川市',
    path: 'M 600 90 L 610 95 L 620 100 L 630 105 L 645 108 L 660 110 L 672 112 L 680 110 L 688 112 L 695 118 L 702 122 L 715 125 L 728 128 L 742 130 L 738 138 L 740 142 L 742 145 L 746 150 L 748 153 L 746 160 L 742 165 L 728 172 L 718 175 L 712 178 L 705 182 L 688 190 L 680 198 L 674 202 L 668 210 L 645 212 L 630 215 L 615 220 L 602 225 L 590 230 L 575 235 L 560 240 L 545 242 L 525 244 L 540 235 L 535 230 L 538 225 L 542 220 L 542 208 L 542 200 L 552 188 L 555 185 L 562 168 L 568 160 L 580 155 L 600 90 Z',
    labelPosition: { x: 640, y: 175 },
  },
  {
    id: 'shizuishan',
    name: '石嘴山市',
    path: 'M 750 50 L 755 60 L 762 65 L 770 72 L 780 82 L 782 88 L 805 92 L 815 98 L 818 105 L 812 110 L 778 118 L 765 122 L 755 126 L 745 132 L 732 142 L 722 162 L 720 180 L 715 188 L 695 195 L 698 202 L 680 200 L 672 196 L 668 195 L 680 190 L 695 188 L 715 180 L 720 175 L 722 165 L 720 158 L 718 155 L 715 150 L 712 145 L 710 142 L 708 138 L 715 128 L 705 125 L 692 122 L 680 120 L 672 118 L 665 115 L 658 112 L 648 110 L 635 108 L 622 105 L 612 100 L 605 95 L 595 92 L 618 85 L 622 75 L 660 62 L 675 63 L 678 45 L 698 40 L 728 42 L 745 32 L 748 35 L 750 50 Z',
    labelPosition: { x: 715, y: 125 },
  },
  {
    id: 'wuzhong',
    name: '吴忠市',
    path: 'M 680 200 L 695 205 L 715 208 L 740 215 L 800 230 L 855 238 L 865 238 L 875 235 L 895 230 L 918 232 L 932 235 L 938 238 L 955 248 L 968 254 L 975 262 L 980 268 L 992 272 L 1005 275 L 1015 278 L 1028 280 L 1025 292 L 1015 298 L 990 300 L 978 302 L 975 308 L 950 310 L 942 320 L 928 328 L 940 330 L 934 340 L 918 348 L 908 354 L 902 360 L 912 368 L 920 370 L 922 374 L 916 376 L 910 378 L 912 384 L 920 388 L 935 392 L 938 395 L 935 400 L 932 402 L 928 405 L 920 405 L 915 408 L 910 408 L 898 405 L 892 403 L 870 402 L 850 402 L 842 405 L 832 406 L 825 405 L 822 402 L 814 400 L 808 400 L 800 402 L 790 400 L 780 396 L 772 394 L 768 396 L 765 400 L 762 404 L 755 406 L 745 406 L 728 405 L 726 405 L 722 408 L 725 425 L 722 435 L 705 432 L 692 440 L 708 442 L 720 438 L 718 448 L 725 456 L 712 464 L 695 462 L 682 470 L 675 480 L 672 485 L 652 482 L 640 482 L 618 484 L 608 486 L 590 488 L 588 480 L 580 475 L 575 472 L 572 468 L 560 465 L 555 462 L 552 458 L 540 450 L 532 445 L 528 442 L 525 438 L 512 430 L 505 425 L 500 420 L 495 415 L 482 408 L 475 405 L 472 400 L 462 398 L 455 392 L 448 385 L 438 380 L 425 378 L 412 380 L 405 384 L 390 386 L 375 380 L 368 378 L 358 380 L 345 380 L 330 378 L 312 376 L 295 375 L 270 374 L 265 370 L 252 365 L 238 367 L 225 370 L 208 373 L 196 368 L 168 364 L 148 360 L 140 355 L 128 350 L 115 338 L 82 336 L 58 336 L 50 333 L 42 328 L 50 323 L 60 322 L 68 320 L 80 316 L 86 314 L 100 308 L 105 305 L 100 302 L 95 302 L 75 305 L 52 306 L 32 304 L 8 302 L -22 304 L -45 302 L -70 302 L -87 302 L -82 290 L -17 290 L 12 288 L 38 282 L 88 286 L 125 288 L 148 284 L 182 278 L 202 274 L 252 262 L 292 258 L 300 260 L 330 264 L 355 262 L 360 262 L 355 252 L 378 268 L 400 270 L 435 268 L 452 272 L 472 274 L 492 278 L 512 282 L 530 286 L 550 290 L 562 292 L 558 302 L 550 306 L 520 308 L 508 310 L 505 316 L 478 320 L 470 330 L 452 332 L 468 334 L 480 330 L 478 340 L 485 348 L 472 356 L 452 355 L 438 362 L 430 375 L 425 380 L 405 376 L 385 375 L 378 374 L 370 374 L 368 366 L 365 355 L 375 348 L 398 345 L 412 352 L 420 350 L 428 350 L 440 352 L 450 352 L 458 355 L 460 362 L 456 365 L 448 368 L 450 373 L 460 378 L 475 382 L 478 385 L 476 388 L 475 392 L 470 394 L 462 394 L 458 396 L 452 396 L 440 393 L 435 390 L 410 388 L 388 390 L 380 392 L 370 394 L 368 393 L 365 395 L 368 412 L 365 422 L 348 418 L 335 428 L 350 430 L 365 425 L 362 436 L 370 444 L 358 452 L 338 450 L 325 458 L 315 470 L 312 476 L 290 472 L 278 472 L 255 474 L 245 478 L 225 480 L 222 472 L 215 466 L 210 462 L 208 458 L 195 450 L 188 445 L 185 442 L 175 438 L 168 432 L 160 426 L 148 420 L 135 418 L 122 420 L 115 425 L 100 428 L 85 422 L 75 420 L 68 422 L 55 424 L 42 422 L 25 420 L 22 420 L 20 422 L 22 440 L 18 450 L 38 445 L 52 455 L 45 460 L 32 462 L 12 464 L -15 465 L -45 468 L -65 458 L -82 456 L -90 462 L -102 464 L -115 460 L -122 458 L -132 458 L -150 460 L -168 460 L -182 458 L -195 452 L -205 450 L -215 440 L -212 432 L -198 425 L -182 426 L -165 424 L -148 426 L -128 428 L -115 425 L -90 424 L -72 426 L -52 425 L -38 426 L -22 424 L 8 420 L 32 424 L 52 424 L 75 422 L 95 420 L 100 420 L 105 422 L 100 426 L 85 432 L 78 435 L 65 438 L 58 438 L 48 438 L 38 444 L 45 448 L 55 452 L 80 452 L 115 454 L 128 468 L 140 474 L 148 480 L 168 484 L 198 488 L 208 495 L 225 492 L 238 490 L 252 488 L 265 492 L 378 382 L 355 368 L 360 378 L 355 380 L 330 382 L 300 378 L 292 376 L 252 380 L 202 392 L 182 396 L 148 404 L 125 408 L 88 408 L 38 404 L 12 410 L -17 412 L -35 420 L -68 416 L -87 426 L -70 425 L -45 424 L -22 426 L 8 425 L 32 428 L 52 428 L 75 426 L 95 422 L 100 424 L 105 426 L 100 430 L 85 436 L 78 438 L 65 442 L 58 442 L 48 442 L 38 448 L 45 452 L 55 455 L 80 455 L 115 458 L 128 472 L 140 478 L 148 484 L 168 488 L 198 492 L 208 499 L 225 496 L 238 494 L 252 492 L 265 496 L 378 385 L 400 388 L 435 385 L 452 388 L 472 390 L 492 395 L 512 398 L 530 402 L 550 406 L 562 408 L 558 418 L 550 422 L 520 424 L 508 426 L 505 432 L 478 436 L 470 446 L 452 448 L 468 450 L 480 446 L 478 456 L 485 464 L 472 472 L 452 470 L 438 478 L 430 490 L 425 495 L 405 492 L 385 490 L 378 490 L 370 490 L 368 482 L 365 472 L 375 465 L 398 462 L 412 468 L 420 466 L 428 466 L 440 468 L 450 468 L 458 472 L 460 478 L 456 482 L 448 485 L 450 490 L 460 495 L 475 498 L 478 502 L 476 505 L 475 508 L 470 510 L 462 510 L 458 512 L 452 512 L 440 508 L 435 505 L 410 502 L 388 505 L 380 508 L 370 510 L 368 510 L 365 512 L 368 528 L 365 538 L 348 535 L 335 545 L 350 548 L 365 542 L 362 554 L 370 562 L 358 570 L 338 568 L 325 576 L 315 588 L 312 594 L 290 590 L 278 590 L 255 592 L 245 596 L 225 598 L 222 590 L 215 584 L 210 580 L 208 576 L 195 568 L 188 562 L 185 560 L 175 556 L 168 550 L 160 544 L 148 538 L 135 535 L 122 538 L 115 542 L 100 545 L 85 540 L 75 538 L 68 540 L 55 542 L 42 540 L 25 538 L 22 538 L 20 540 L 22 558 L 18 568 L 38 562 L 52 572 L 45 578 L 32 580 L 12 582 L -15 584 L -45 586 L -65 576 L -82 574 L -90 580 L -102 582 L -115 578 L -122 575 L -132 575 L -150 578 L -168 578 L -182 575 L -195 570 L -205 568 L -215 558 L -212 550 L -198 542 L -182 544 L -165 542 L -148 544 L -128 548 L -115 545 L -90 544 L -72 546 L -52 545 L -38 546 L -22 544 L 8 540 L 32 545 L 52 545 L 75 542 L 95 538 L 100 540 L 105 542 L 100 546 L 85 552 L 78 555 L 65 558 L 58 558 L 48 558 L 38 564 L 45 568 L 55 572 L 80 572 L 115 575 L 128 588 L 140 595 L 148 600 L 168 604 L 198 608 L 208 615 L 225 612 L 238 610 L 252 608 L 265 612 L 378 502 L 400 505 L 435 502 L 452 505 L 472 508 L 492 512 L 512 515 L 530 520 L 550 524 L 562 526 L 558 536 L 550 540 L 520 542 L 508 545 L 505 550 L 478 555 L 470 565 L 452 568 L 468 570 L 480 565 L 478 575 L 485 584 L 472 592 L 452 590 L 438 598 L 430 610 L 425 615 L 405 612 L 385 610 L 378 610 L 370 610 L 368 602 L 365 592 L 375 585 L 398 582 L 412 588 L 420 586 L 428 586 L 440 588 L 450 588 L 458 592 L 460 598 L 456 602 L 448 605 L 450 610 L 460 615 L 475 618 L 478 622 L 476 625 L 475 628 L 470 630 L 462 630 L 458 632 L 452 632 L 440 628 L 435 625 L 410 622 L 388 625 L 380 628 L 370 630 L 368 630 L 365 632 L 368 648 L 365 658 L 348 655 L 335 665 L 350 668 L 365 662 L 362 674 L 370 682 L 358 690 L 338 688 L 325 696 L 315 708 L 312 714 L 290 710 L 278 710 L 255 712 L 245 716 L 225 718 L 222 710 L 215 704 L 210 700 L 208 696 L 195 688 L 188 682 L 185 680 L 175 676 L 168 670 L 160 664 L 148 658 L 135 655 L 122 658 L 115 662 L 100 665 L 85 660 L 75 658 L 68 660 L 55 662 L 42 660 L 25 658 L 22 658 L 20 660 L 22 678 L 18 688 L 38 682 L 52 692 L 45 698 L 32 700 L 12 702 L -15 704 L -45 706 L -65 696 L -82 694 L -90 700 L -102 702 L -115 698 L -122 695 L -132 695 L -150 698 L -168 698 L -182 695 L -195 690 L -205 688 L -215 678 L -212 670 L -198 662 L -182 664 L -165 662 L -148 664 L -128 668 L -115 665 L -90 664 L -72 666 L -52 665 L -38 666 L -22 664 L 8 660 L 32 665 L 52 665 L 75 662 L 95 658 L 100 660 L 105 662 L 100 666 L 85 672 L 78 675 L 65 678 L 58 678 L 48 678 L 38 684 L 45 688 L 55 692 L 80 692 L 115 695 L 128 708 L 140 715 L 148 720 L 168 724 L 198 728 L 208 735 L 225 732 L 238 730 L 252 728 L 265 732 L 378 622 L 355 608 L 360 618 L 355 620 L 330 622 L 300 618 L 292 616 L 252 620 L 202 632 L 182 636 L 148 644 L 125 648 L 88 648 L 38 644 L 12 650 L -17 652 L -35 660 L -68 656 L -87 666 L -70 665 L -45 664 L -22 666 L 8 665 L 32 668 L 52 668 L 75 665 L 95 660 L 100 662 L 105 665 L 100 669 L 85 675 L 78 678 L 65 681 L 58 681 L 48 681 L 38 687 L 45 691 L 55 695 L 80 695 L 115 698 L 128 711 L 140 718 L 148 724 L 168 728 L 198 732 L 208 739 L 225 736 L 238 734 L 252 732 L 265 736 L 378 625 L 400 628 L 435 625 L 452 628 L 472 630 L 492 635 L 512 638 L 530 642 L 550 646 L 562 648 L 558 658 L 550 662 L 520 665 L 508 668 L 505 672 L 478 676 L 470 686 L 452 688 L 468 690 L 480 686 L 478 696 L 485 705 L 472 712 L 452 710 L 438 718 L 430 730 L 425 735 L 405 732 L 385 730 L 378 730 L 370 730 L 368 722 L 365 712 L 375 705 L 398 702 L 412 708 L 420 706 L 428 706 L 440 708 L 450 708 L 458 712 L 460 718 L 456 722 L 448 725 L 450 730 L 460 735 L 475 738 L 478 742 L 476 745 L 475 748 L 470 750 L 462 750 L 458 752 L 452 752 L 440 748 L 435 745 L 410 742 L 388 745 L 380 748 L 370 750 L 368 750 L 365 752 L 368 768 L 365 778 L 348 775 L 335 785 L 350 788 L 365 782 L 362 794 L 370 802 L 358 810 L 338 808 L 325 816 L 315 828 L 312 834 L 290 830 L 278 830 L 255 832 L 245 836 L 225 838 L 222 830 L 215 824 L 210 820 L 208 816 L 195 808 L 188 802 L 185 800 L 175 796 L 168 790 L 160 784 L 148 778 L 135 775 L 122 778 L 115 782 L 100 785 L 85 780 L 75 778 L 68 780 L 55 782 L 42 780 L 25 778 L 22 778 L 20 780 L 22 798 L 18 808 L 38 802 L 52 812 L 45 818 L 32 820 L 12 822 L -15 824 L -45 826 L -65 816 L -82 814 L -90 820 L -102 822 L -115 818 L -122 815 L -132 815 L -150 818 L -168 818 L -182 815 L -195 810 L -205 808 L -215 798 L -212 790 L -198 782 L -182 784 L -165 782 L -148 784 L -128 788 L -115 785 L -90 784 L -72 786 L -52 785 L -38 786 L -22 784 L 8 780 L 32 785 L 52 785 L 75 782 L 95 778 L 100 780 L 105 782 L 100 786 L 85 792 L 78 795 L 65 798 L 58 798 L 48 798 L 38 804 L 45 808 L 55 812 L 80 812 L 115 815 L 128 828 L 140 835 L 148 840 L 168 844 L 198 848 L 208 855 L 225 852 L 238 850 L 252 848 L 265 852 L 378 742 L 400 745 L 435 742 L 452 745 L 472 748 L 492 752 L 512 755 L 530 760 L 550 764 L 562 766 L 558 776 L 550 780 L 520 782 L 508 785 L 505 790 L 478 795 L 470 805 L 452 808 L 468 810 L 480 805 L 478 815 L 485 824 L 472 832 L 452 830 L 438 838 L 430 850 L 425 855 L 405 852 L 385 850 L 378 850 L 370 850 L 368 842 L 365 832 L 375 825 L 398 822 L 412 828 L 420 826 L 428 826 L 440 828 L 450 828 L 458 832 L 460 838 L 456 842 L 448 845 L 450 850 L 460 855 L 475 858 L 478 862 L 476 865 L 475 868 L 470 870 L 462 870 L 458 872 L 452 872 L 440 868 L 435 865 L 410 862 L 388 865 L 380 868 L 370 870 L 368 870 L 365 872 L 368 888 L 365 898 L 348 895 L 335 905 L 350 908 L 365 902 L 362 914 L 370 922 L 358 930 L 338 928 L 325 936 L 315 948 L 312 954 L 290 950 L 278 950 L 255 952 L 245 956 L 225 958 L 222 950 L 215 944 L 210 940 L 208 936 L 195 928 L 188 922 L 185 920 L 175 916 L 168 910 L 160 904 L 148 898 L 135 895 L 122 898 L 115 902 L 100 905 L 85 900 L 75 898 L 68 900 L 55 902 L 42 900 L 25 898 L 22 898 L 20 900 L 22 918 L 18 928 L 38 922 L 52 932 L 45 938 L 32 940 L 12 942 L -15 944 L -45 946 L -65 936 L -82 934 L -90 940 L -102 942 L -115 938 L -122 935 L -132 935 L -150 938 L -168 938 L -182 935 L -195 930 L -205 928 L -215 918 L -212 910 L -198 902 L -182 904 L -165 902 L -148 904 L -128 908 L -115 905 L -90 904 L -72 906 L -52 905 L -38 906 L -22 905 L 8 900 L 32 905 L 52 905 L 75 902 L 95 898 L 100 900 L 105 902 L 100 906 L 85 912 L 78 915 L 65 918 L 58 918 L 48 918 L 38 924 L 45 928 L 55 932 L 80 932 L 115 935 L 128 948 L 140 955 L 148 960 L 168 964 L 198 968 L 208 975 L 225 972 L 238 970 L 252 968 L 265 972 L 378 862 L 400 865 L 435 862 L 452 865 L 472 868 L 492 872 L 512 875 L 530 880 L 550 884 L 562 886 L 558 896 L 550 900 L 520 902 L 508 905 L 505 910 L 478 915 L 470 925 L 452 928 L 468 930 L 480 925 L 478 935 L 485 944 L 472 952 L 452 950 L 438 958 L 430 970 L 425 975 L 405 972 L 385 970 L 378 970 L 370 970 L 368 962 L 365 952 L 375 945 L 398 942 L 412 948 L 420 946 L 428 946 L 440 948 L 450 948 L 458 952 L 460 958 L 456 962 L 448 965 L 450 970 L 460 975 L 475 978 L 478 982 L 476 985 L 475 988 L 470 990 L 462 990 L 458 992 L 452 992 L 440 988 L 435 985 L 410 982 L 388 985 L 380 988 L 370 990 L 368 990 L 365 992 L 368 1008 L 365 1018 L 348 1015 L 335 1025 L 350 1028 L 365 1022 L 362 1034 L 370 1042 L 358 1050 L 338 1048 L 325 1056 L 315 1068 L 312 1074 L 290 1070 L 278 1070 L 255 1072 L 245 1076 L 225 1078 L 222 1070 L 215 1064 L 210 1060 L 208 1056 L 195 1048 L 188 1042 L 185 1040 L 175 1036 L 168 1030 L 160 1024 L 148 1018 L 135 1015 L 122 1018 L 115 1022 L 100 1025 L 85 1020 L 75 1018 L 68 1020 L 55 1022 L 42 1020 L 25 1018 L 22 1018 L 20 1020 L 22 1038 L 18 1048 L 38 1042 L 52 1052 L 45 1058 L 32 1060 L 12 1062 L -15 1064 L -45 1066 L -65 1056 L -82 1054 L -90 1060 L -102 1062 L -115 1058 L -122 1055 L -132 1055 L -150 1058 L -168 1058 L -182 1055 L -195 1050 L -205 1048 L -215 1038 L -212 1030 L -198 1022 L -182 1024 L -165 1022 L -148 1024 L -128 1028 L -115 1025 L -90 1024 L -72 1026 L -52 1025 L -38 1026 L -22 1025 L 8 1020 L 32 1025 L 52 1025 L 75 1022 L 95 1018 L 100 1020 L 105 1022 L 100 1026 L 85 1032 L 78 1035 L 65 1038 L 58 1038 L 48 1038 L 38 1044 L 45 1048 L 55 1052 L 80 1052 L 115 1055 L 128 1068 L 140 1075 L 148 1080 L 168 1084 L 198 1088 L 208 1095 L 225 1092 L 238 1090 L 252 1088 L 265 1092 L 378 982 L 355 968 L 360 978 L 355 980 L 330 982 L 300 978 L 292 976 L 252 980 L 202 992 L 182 996 L 148 1004 L 125 1008 L 88 1008 L 38 1004 L 12 1010 L -17 1012 L -35 1020 L -68 1016 L -87 1026 L -70 1025 L -45 1024 L -22 1026 L 8 1025 L 32 1028 L 52 1028 L 75 1025 L 95 1020 L 100 1022 L 105 1025 L 100 1029 L 85 1035 L 78 1038 L 65 1041 L 58 1041 L 48 1041 L 38 1047 L 45 1051 L 55 1055 L 80 1055 L 115 1058 L 128 1071 L 140 1078 L 148 1084 L 168 1088 L 198 1092 L 208 1099 L 225 1096 L 238 1094 L 252 1092 L 265 1096 L 378 985 L 680 200 Z',
    labelPosition: { x: 600, y: 520 },
  },
  {
    id: 'guyuan',
    name: '固原市',
    path: 'M 265 370 L 270 374 L 295 375 L 312 376 L 330 378 L 345 380 L 358 380 L 368 378 L 375 380 L 390 386 L 405 384 L 412 380 L 425 378 L 438 380 L 448 385 L 455 392 L 462 398 L 472 400 L 475 405 L 482 408 L 495 415 L 500 420 L 505 425 L 512 430 L 525 438 L 528 442 L 532 445 L 540 450 L 552 458 L 555 462 L 560 465 L 572 468 L 575 472 L 580 475 L 588 480 L 590 488 L 608 486 L 618 484 L 640 482 L 652 482 L 672 485 L 640 492 L 668 502 L 680 508 L 685 518 L 680 525 L 678 528 L 672 532 L 688 532 L 712 532 L 735 536 L 758 540 L 785 540 L 790 542 L 798 548 L 802 554 L 815 560 L 816 580 L 790 590 L 802 604 L 808 614 L 782 614 L 775 622 L 762 620 L 755 618 L 742 625 L 680 200 Z',
    labelPosition: { x: 550, y: 480 },
  },
  {
    id: 'zhongwei',
    name: '中卫市',
    path: 'M 378 268 L 355 252 L 360 262 L 355 262 L 330 264 L 300 260 L 292 258 L 252 262 L 202 274 L 182 278 L 148 284 L 125 288 L 88 286 L 38 282 L 12 288 L -17 290 L -35 298 L -68 294 L -87 302 L -70 302 L -45 302 L -22 304 L 8 302 L 32 304 L 52 306 L 75 305 L 95 302 L 100 302 L 105 305 L 100 308 L 86 314 L 80 316 L 68 320 L 60 322 L 50 323 L 42 328 L 50 333 L 58 336 L 82 336 L 115 338 L 128 350 L 140 355 L 148 360 L 168 364 L 196 368 L 208 373 L 225 370 L 238 367 L 252 365 L 265 370 L 742 625 L 755 618 L 762 620 L 775 622 L 782 614 L 808 614 L 378 268 Z',
    labelPosition: { x: 350, y: 440 },
  },
];

export default function NingxiaMap({
  onAttractionClick,
  selectedCity,
  onCityClick,
  filterType = 'all'
}: NingxiaMapProps) {
  const [hoveredAttraction, setHoveredAttraction] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredAttractions = filterType === 'all' 
    ? attractionsData 
    : attractionsData.filter(a => a.type === filterType);

  const handleAttractionClick = (attraction: Attraction) => {
    if (onAttractionClick) {
      onAttractionClick(attraction);
    } else {
      navigate(`/attraction/${attraction.id}`);
    }
  };

  const handleCityClick = (cityId: string, cityName: string) => {
    if (onCityClick) {
      onCityClick(cityName);
    } else {
      navigate(`/city/${cityId}`);
    }
  };

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 1020 1100"
        className="w-full h-auto"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <defs>
          <linearGradient id="sandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8DCC8" />
            <stop offset="100%" stopColor="#C4A35A" />
          </linearGradient>
          
          <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D5A4A" />
            <stop offset="100%" stopColor="#3D6B5A" />
          </linearGradient>

          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect
          x="0"
          y="0"
          width="1020"
          height="1100"
          fill="#F5F2EB"
          rx="20"
        />

        <g filter="url(#shadow)">
          {cityRegions.map((city) => {
            const isSelected = selectedCity === city.id;
            const isHovered = hoveredCity === city.id;
            
            return (
              <g key={city.id}>
                <path
                  d={city.path}
                  fill={isSelected ? 'url(#selectedGradient)' : isHovered ? '#D4A857' : 'url(#sandGradient)'}
                  stroke={isSelected ? '#2D5A4A' : '#B89B5D'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredCity(city.id)}
                  onMouseLeave={() => setHoveredCity(null)}
                  onClick={() => handleCityClick(city.id, city.name)}
                  style={{
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    transformOrigin: `${city.labelPosition.x}px ${city.labelPosition.y}px`,
                  }}
                />
                
                <text
                  x={city.labelPosition.x}
                  y={city.labelPosition.y - 5}
                  textAnchor="middle"
                  className="text-sm font-serif font-bold fill-current pointer-events-none"
                  style={{ 
                    fill: isSelected ? '#FFFFFF' : '#1A1A1A',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </g>

        {filteredAttractions.map((attraction, index) => {
          const isHovered = hoveredAttraction === attraction.id;
          
          return (
            <g
              key={attraction.id}
              className="cursor-pointer"
              style={{ animation: `markerBounce 0.6s ease-out ${index * 100}ms` }}
              onMouseEnter={() => setHoveredAttraction(attraction.id)}
              onMouseLeave={() => setHoveredAttraction(null)}
              onClick={() => handleAttractionClick(attraction as Attraction)}
            >
              <circle
                cx={attraction.coordinates.x}
                cy={attraction.coordinates.y}
                r={isHovered ? 16 : 12}
                fill="#E85D4C"
                stroke="#FFFFFF"
                strokeWidth="3"
                filter={isHovered ? 'url(#glow)' : undefined}
                className="transition-all duration-300"
                style={{
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  transformOrigin: `${attraction.coordinates.x}px ${attraction.coordinates.y}px`,
                }}
              />
              
              <text
                x={attraction.coordinates.x}
                y={attraction.coordinates.y + 4}
                textAnchor="middle"
                className="text-xs pointer-events-none"
                style={{ fill: '#FFFFFF', fontSize: '8px', fontWeight: 600 }}
              >
                •
              </text>

              {isHovered && (
                <g>
                  <rect
                    x={attraction.coordinates.x - 75}
                    y={attraction.coordinates.y - 80}
                    width="150"
                    height="70"
                    rx="8"
                    fill="#FFFFFF"
                    filter="url(#shadow)"
                  />
                  
                  <text
                    x={attraction.coordinates.x}
                    y={attraction.coordinates.y - 55}
                    textAnchor="middle"
                    className="text-sm font-serif font-bold"
                    style={{ fill: '#1A1A1A', fontSize: '12px' }}
                  >
                    {attraction.name}
                  </text>
                  
                  <text
                    x={attraction.coordinates.x}
                    y={attraction.coordinates.y - 38}
                    textAnchor="middle"
                    className="text-xs"
                    style={{ fill: '#6B6B6B', fontSize: '9px' }}
                  >
                    {attraction.city}
                  </text>
                  
                  <text
                    x={attraction.coordinates.x}
                    y={attraction.coordinates.y - 22}
                    textAnchor="middle"
                    className="text-xs flex items-center justify-center gap-1"
                    style={{ fill: '#C4A35A', fontSize: '10px' }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    {attraction.rating}
                  </text>
                  
                  <text
                    x={attraction.coordinates.x}
                    y={attraction.coordinates.y - 8}
                    textAnchor="middle"
                    className="text-xs"
                    style={{ fill: '#6B6B6B', fontSize: '8px' }}
                  >
                    点击查看详情 →
                  </text>
                </g>
              )}
            </g>
          );
        })}

        <text
          x="510"
          y="1080"
          textAnchor="middle"
          className="text-sm fill-current"
          style={{ fill: '#6B6B6B', fontSize: '11px' }}
        >
          宁夏回族自治区 · 点击城市或景点探索
        </text>
      </svg>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-soft">
        <h4 className="text-sm font-serif font-bold mb-2">图例说明</h4>
        <div className="space-y-1 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span>地级市区域</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span>景点位置</span>
          </div>
        </div>
      </div>
    </div>
  );
}
