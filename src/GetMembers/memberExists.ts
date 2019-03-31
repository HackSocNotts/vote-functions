import getMembers from './getMembers';

export default (memberId: number): Promise<boolean> => {

    return getMembers()
        .then(membersSetting => {
            return membersSetting.members.includes(memberId)
        });
}
