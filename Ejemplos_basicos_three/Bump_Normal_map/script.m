%%
normalmap = imread('wotig-normal128.png');
bumpmap = imread('wotig-bump.png');

%%
close all;

figure; 
subplot(2,2,1);
imshow(normalmap(:,:,:));
title('Channel All');
subplot(2,2,2);
imshow(normalmap(:,:,1));
title('Channel Red');
subplot(2,2,3);
imshow(normalmap(:,:,2));
title('Channel Green');
subplot(2,2,4);
imshow(normalmap(:,:,3));
title('Channel Blue');

figure; 
subplot(2,2,1);
imshow(bumpmap(:,:,:));
title('Channel All');
subplot(2,2,2);
imshow(bumpmap(:,:,1));
title('Channel Red');
subplot(2,2,3);
imshow(bumpmap(:,:,2));
title('Channel Green');
subplot(2,2,4);
imshow(bumpmap(:,:,3));
title('Channel Blue');