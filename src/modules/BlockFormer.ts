
class BlockFormer {
    static MW_classlength = 50;
    static TH_classlength = 75;
    static breaklength = 20;
    
    static starts = {        
        MW_A:  new Date(0),
        MW_B:  new Date(1000*60*1*(BlockFormer.MW_classlength+BlockFormer.breaklength)),
        MW_C:  new Date(1000*60*2*(BlockFormer.MW_classlength+BlockFormer.breaklength)),
        
        MW_A2: new Date(1000*60*3*(BlockFormer.MW_classlength+BlockFormer.breaklength)),
        MW_B2: new Date(1000*60*4*(BlockFormer.MW_classlength+BlockFormer.breaklength)),
        MW_C2: new Date(1000*60*5*(BlockFormer.MW_classlength+BlockFormer.breaklength)),
        
        MW_A3: new Date(1000*60*6*(BlockFormer.MW_classlength+BlockFormer.breaklength)),
        MW_B3: new Date(1000*60*7*(BlockFormer.MW_classlength+BlockFormer.breaklength)),
        MW_C3: new Date(1000*60*8*(BlockFormer.MW_classlength+BlockFormer.breaklength)),

        TH_A:  new Date(0),
        TH_B:  new Date(1000*60*1*(BlockFormer.TH_classlength+BlockFormer.breaklength)),
        TH_C:  new Date(1000*60*2*(BlockFormer.TH_classlength+BlockFormer.breaklength)),
        
        TH_A2: new Date(1000*60*3*(BlockFormer.TH_classlength+BlockFormer.breaklength)),
        TH_B2: new Date(1000*60*4*(BlockFormer.TH_classlength+BlockFormer.breaklength)),
        TH_C2: new Date(1000*60*5*(BlockFormer.TH_classlength+BlockFormer.breaklength)),
        
        TH_A3: new Date(1000*60*6*(BlockFormer.TH_classlength+BlockFormer.breaklength)),
        TH_B3: new Date(1000*60*7*(BlockFormer.TH_classlength+BlockFormer.breaklength)),
        TH_C3: new Date(1000*60*8*(BlockFormer.TH_classlength+BlockFormer.breaklength)),
    }

    static setTimes = {
        MW_A_short: new Date(BlockFormer.starts.MW_A.getTime() + 1000*60*BlockFormer.MW_classlength),
        MW_A_long: new Date(BlockFormer.starts.MW_A.getTime() + 1000*60*(BlockFormer.MW_classlength*2+BlockFormer.breaklength)),
        MW_A_extralong: new Date(BlockFormer.starts.MW_A.getTime() + 1000*60*(BlockFormer.MW_classlength*3+BlockFormer.breaklength*2)),
            
        MW_B_short: new Date(BlockFormer.starts.MW_B.getTime() + 1000*60*BlockFormer.MW_classlength),
        MW_B_long: new Date(BlockFormer.starts.MW_B.getTime() + 1000*60*(BlockFormer.MW_classlength*2+BlockFormer.breaklength)),
            
        MW_C_short: new Date(BlockFormer.starts.MW_C.getTime() + 1000*60*BlockFormer.MW_classlength),
            
        MW_A2_short: new Date(BlockFormer.starts.MW_A2.getTime() + 1000*60*BlockFormer.MW_classlength),
        MW_A2_long: new Date(BlockFormer.starts.MW_A2.getTime() + 1000*60*(BlockFormer.MW_classlength*2+BlockFormer.breaklength)),
        MW_A2_extralong: new Date(BlockFormer.starts.MW_A2.getTime() + 1000*60*(BlockFormer.MW_classlength*3+BlockFormer.breaklength*2)),
            
        MW_B2_short: new Date(BlockFormer.starts.MW_B2.getTime() + 1000*60*BlockFormer.MW_classlength),
        MW_B2_long: new Date(BlockFormer.starts.MW_B2.getTime() + 1000*60*(BlockFormer.MW_classlength*2+BlockFormer.breaklength)),
            
        MW_C2_short: new Date(BlockFormer.starts.MW_C2.getTime() + 1000*60*BlockFormer.MW_classlength),
            
        MW_A3_short: new Date(BlockFormer.starts.MW_A3.getTime() + 1000*60*BlockFormer.MW_classlength),
        MW_A3_long: new Date(BlockFormer.starts.MW_A3.getTime() + 1000*60*(BlockFormer.MW_classlength*2+BlockFormer.breaklength)),
        MW_A3_extralong: new Date(BlockFormer.starts.MW_A3.getTime() + 1000*60*(BlockFormer.MW_classlength*3+BlockFormer.breaklength*2)),
            
        MW_B3_short: new Date(BlockFormer.starts.MW_B3.getTime() + 1000*60*BlockFormer.MW_classlength),
        MW_B3_long: new Date(BlockFormer.starts.MW_B3.getTime() + 1000*60*(BlockFormer.MW_classlength*2+BlockFormer.breaklength)),
            
        MW_C3_short: new Date(BlockFormer.starts.MW_C3.getTime() + 1000*60*BlockFormer.MW_classlength),
            
            
        TH_A_short: new Date(BlockFormer.starts.TH_A.getTime() + 1000*60*BlockFormer.TH_classlength),
        TH_A_long: new Date(BlockFormer.starts.TH_A.getTime() + 1000*60*(BlockFormer.TH_classlength*2+BlockFormer.breaklength)),
        TH_A_extralong: new Date(BlockFormer.starts.TH_A.getTime() + 1000*60*(BlockFormer.TH_classlength*3+BlockFormer.breaklength*2)),
            
        TH_B_short: new Date(BlockFormer.starts.TH_B.getTime() + 1000*60*BlockFormer.TH_classlength),
        TH_B_long: new Date(BlockFormer.starts.TH_B.getTime() + 1000*60*(BlockFormer.TH_classlength*2+BlockFormer.breaklength)),
            
        TH_C_short: new Date(BlockFormer.starts.TH_C.getTime() + 1000*60*BlockFormer.TH_classlength),
            
        TH_A2_short: new Date(BlockFormer.starts.TH_A2.getTime() + 1000*60*BlockFormer.TH_classlength),
        TH_A2_long: new Date(BlockFormer.starts.TH_A2.getTime() + 1000*60*(BlockFormer.TH_classlength*2+BlockFormer.breaklength)),
        TH_A2_extralong: new Date(BlockFormer.starts.TH_A2.getTime() + 1000*60*(BlockFormer.TH_classlength*3+BlockFormer.breaklength*2)),
            
        TH_B2_short: new Date(BlockFormer.starts.TH_B2.getTime() + 1000*60*BlockFormer.TH_classlength),
        TH_B2_long: new Date(BlockFormer.starts.TH_B2.getTime() + 1000*60*(BlockFormer.TH_classlength*2+BlockFormer.breaklength)),
            
        TH_C2_short: new Date(BlockFormer.starts.TH_C2.getTime() + 1000*60*BlockFormer.TH_classlength),
            
        TH_A3_short: new Date(BlockFormer.starts.TH_A3.getTime() + 1000*60*BlockFormer.TH_classlength),
        TH_A3_long: new Date(BlockFormer.starts.TH_A3.getTime() + 1000*60*(BlockFormer.TH_classlength*2+BlockFormer.breaklength)),
        TH_A3_extralong: new Date(BlockFormer.starts.TH_A3.getTime() + 1000*60*(BlockFormer.TH_classlength*3+BlockFormer.breaklength*2)),
            
        TH_B3_short: new Date(BlockFormer.starts.TH_B3.getTime() + 1000*60*BlockFormer.TH_classlength),
        TH_B3_long: new Date(BlockFormer.starts.TH_B3.getTime() + 1000*60*(BlockFormer.TH_classlength*2+BlockFormer.breaklength)),
            
        TH_C3_short: new Date(BlockFormer.starts.TH_C3.getTime() + 1000*60*BlockFormer.TH_classlength),
    }

    static samples = {
        Empty_schedule: [],
        Test_schedule: [
            {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
            {course: 121, section: 106, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
            {course: 121, section: 106, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
            
            {course: 221, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 313, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},

            {course: 315, section: 104, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
        ],
        M_schedule: [
            // MONDAYS //
            {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 221, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 221, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 313, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            
            {course: 121, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 121, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 121, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 221, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 221, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 313, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            
            {course: 121, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 121, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 121, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 221, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 221, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 313, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            
            
            {course: 121, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 221, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 313, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            
            {course: 121, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 221, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 313, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 315, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            
            {course: 121, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 221, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 313, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            
            
            {course: 121, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 121, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 121, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 221, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 221, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 313, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            
            {course: 121, section: 108, start: BlockFormer.starts.MW_B3, end: BlockFormer.setTimes.MW_B3_short},
            {course: 121, section: 108, start: BlockFormer.starts.MW_B3, end: BlockFormer.setTimes.MW_B3_short},
            {course: 121, section: 108, start: BlockFormer.starts.MW_B3, end: BlockFormer.setTimes.MW_B3_short},
            {course: 221, section: 108, start: BlockFormer.starts.MW_B3, end: BlockFormer.setTimes.MW_B3_short},
            {course: 221, section: 108, start: BlockFormer.starts.MW_B3, end: BlockFormer.setTimes.MW_B3_short},
            {course: 313, section: 108, start: BlockFormer.starts.MW_B3, end: BlockFormer.setTimes.MW_B3_short},
            
            {course: 121, section: 109, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
            {course: 121, section: 109, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
            {course: 121, section: 109, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
            {course: 221, section: 109, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
            {course: 221, section: 109, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
            {course: 313, section: 109, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
            {course: 313, section: 109, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
        ],
        
        TH_shcedule: [
            {course: 121, section: 101, start: BlockFormer.starts.TH_A, end: BlockFormer.setTimes.TH_A_short},
            {course: 121, section: 101, start: BlockFormer.starts.TH_A, end: BlockFormer.setTimes.TH_A_short},
            {course: 121, section: 101, start: BlockFormer.starts.TH_A, end: BlockFormer.setTimes.TH_A_short},
            {course: 221, section: 101, start: BlockFormer.starts.TH_A, end: BlockFormer.setTimes.TH_A_short},
            {course: 221, section: 101, start: BlockFormer.starts.TH_A, end: BlockFormer.setTimes.TH_A_short},
            {course: 313, section: 101, start: BlockFormer.starts.TH_A, end: BlockFormer.setTimes.TH_A_short},
            
            {course: 121, section: 102, start: BlockFormer.starts.TH_B, end: BlockFormer.setTimes.TH_B_short},
            {course: 121, section: 102, start: BlockFormer.starts.TH_B, end: BlockFormer.setTimes.TH_B_short},
            {course: 121, section: 102, start: BlockFormer.starts.TH_B, end: BlockFormer.setTimes.TH_B_short},
            {course: 221, section: 102, start: BlockFormer.starts.TH_B, end: BlockFormer.setTimes.TH_B_short},
            {course: 221, section: 102, start: BlockFormer.starts.TH_B, end: BlockFormer.setTimes.TH_B_short},
            {course: 313, section: 102, start: BlockFormer.starts.TH_B, end: BlockFormer.setTimes.TH_B_short},
            
            {course: 121, section: 103, start: BlockFormer.starts.TH_C, end: BlockFormer.setTimes.TH_C_short},
            {course: 121, section: 103, start: BlockFormer.starts.TH_C, end: BlockFormer.setTimes.TH_C_short},
            {course: 121, section: 103, start: BlockFormer.starts.TH_C, end: BlockFormer.setTimes.TH_C_short},
            {course: 221, section: 103, start: BlockFormer.starts.TH_C, end: BlockFormer.setTimes.TH_C_short},
            {course: 221, section: 103, start: BlockFormer.starts.TH_C, end: BlockFormer.setTimes.TH_C_short},
            {course: 313, section: 103, start: BlockFormer.starts.TH_C, end: BlockFormer.setTimes.TH_C_short},
            {course: 313, section: 103, start: BlockFormer.starts.TH_C, end: BlockFormer.setTimes.TH_C_short},
            {course: 313, section: 103, start: BlockFormer.starts.TH_C, end: BlockFormer.setTimes.TH_C_short},
            
            {course: 121, section: 104, start: BlockFormer.starts.TH_B2, end: BlockFormer.setTimes.TH_B2_short},
            {course: 221, section: 104, start: BlockFormer.starts.TH_B2, end: BlockFormer.setTimes.TH_B2_short},
            {course: 313, section: 104, start: BlockFormer.starts.TH_B2, end: BlockFormer.setTimes.TH_B2_short},
            
            {course: 121, section: 105, start: BlockFormer.starts.TH_C2, end: BlockFormer.setTimes.TH_C2_short},
            {course: 221, section: 105, start: BlockFormer.starts.TH_C2, end: BlockFormer.setTimes.TH_C2_short},
            
            {course: 121, section: 106, start: BlockFormer.starts.TH_A3, end: BlockFormer.setTimes.TH_A3_short},
        ],
        
        W_schedule: [
            {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 221, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 221, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 313, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 313, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 313, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            
            {course: 121, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 121, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 121, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 221, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 221, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 313, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 313, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 313, section: 102, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            
            {course: 121, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 121, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 121, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 121, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 221, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 221, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 221, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 221, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 313, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 313, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 313, section: 103, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            
            {course: 121, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 121, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 121, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 121, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 221, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 221, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 221, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 221, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 313, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 313, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 313, section: 104, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            
            {course: 121, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 121, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 121, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 121, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 221, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 221, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 221, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 221, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 313, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 313, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 313, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 313, section: 105, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            
            {course: 121, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 121, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 121, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 221, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 221, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 221, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 313, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 313, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 313, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 315, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 315, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 315, section: 106, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            
            {course: 121, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 121, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 221, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 221, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 221, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 313, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 313, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 313, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 315, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 315, section: 107, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            
            {course: 121, section: 108, start: BlockFormer.starts.MW_B3, end: BlockFormer.setTimes.MW_B3_short},
            {course: 221, section: 108, start: BlockFormer.starts.MW_B3, end: BlockFormer.setTimes.MW_B3_short},
            {course: 313, section: 108, start: BlockFormer.starts.MW_B3, end: BlockFormer.setTimes.MW_B3_short},
            
            {course: 121, section: 108, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
            {course: 121, section: 108, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
            {course: 221, section: 108, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
            {course: 221, section: 108, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
            {course: 313, section: 108, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
            {course: 315, section: 108, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
        ],
        
        F_schedule: [
            {course: 121, section: 101, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_extralong},
            {course: 121, section: 102, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 121, section: 103, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 221, section: 104, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 221, section: 105, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 313, section: 106, start: BlockFormer.starts.MW_A, end: BlockFormer.setTimes.MW_A_short},
            {course: 221, section: 107, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 313, section: 108, start: BlockFormer.starts.MW_B, end: BlockFormer.setTimes.MW_B_short},
            {course: 121, section: 109, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 221, section: 110, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
            {course: 313, section: 111, start: BlockFormer.starts.MW_C, end: BlockFormer.setTimes.MW_C_short},
                
            {course: 121, section: 112, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong}, // Section is incorrect
            {course: 121, section: 113, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 221, section: 114, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},
            {course: 313, section: 115, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 313, section: 116, start: BlockFormer.starts.MW_B2, end: BlockFormer.setTimes.MW_B2_short},
            {course: 221, section: 117, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
            {course: 315, section: 118, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_extralong},
            {course: 315, section: 119, start: BlockFormer.starts.MW_A2, end: BlockFormer.setTimes.MW_A2_short},
            {course: 315, section: 120, start: BlockFormer.starts.MW_C2, end: BlockFormer.setTimes.MW_C2_short},
                
            {course: 121, section: 121, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 121, section: 122, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_short},
            {course: 121, section: 123, start: BlockFormer.starts.MW_B3, end: BlockFormer.setTimes.MW_B3_short},
            {course: 221, section: 124, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_extralong}, // Arrested
            {course: 221, section: 125, start: BlockFormer.starts.MW_C3, end: BlockFormer.setTimes.MW_C3_short},
            {course: 313, section: 126, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_extralong},
            {course: 315, section: 127, start: BlockFormer.starts.MW_A3, end: BlockFormer.setTimes.MW_A3_extralong},
        ]
    }
}

export default BlockFormer;